import {
  atom,
  selector,
  selectorFamily,
  useRecoilCallback,
  useRecoilValueLoadable,
} from "recoil";

import { Gist, GistFile, RawGistFile, RawGistFileURL } from "./type";
import { accessTokenQuery } from "../access_token";
import { githubUserQuery } from "../user";

export const userGistsQuery = selector<Array<Gist>>({
  key: "myapp.kenichirow.com:gist:gists",
  get: async ({ get }) => {
    const githubToken = await get(accessTokenQuery);
    if (githubToken == "") {
      return Promise.reject();
    }
    const user = await get(githubUserQuery);
    const url = `https://api.github.com/users/${user.login}/gists`;

    const data = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `token ${githubToken}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          return Promise.reject();
        }
        return res.json();
      })
      .catch((error) => {
        return Promise.reject();
      });
    return data;
  },
});

const currentGistIdState = atom<string>({
  key: "myapp.kenichirow.com:gist:current:id",
});

const currentGistQuery2 = selector({
  key: "myapp.kenichirow.com:gist:current:query2",
  get: async ({ get }) => {
    const f = get(currentGistIdState);
    const x = get(userGistsQuery);
    return x.find((g) => g.id == f);
  },
});

const currentGistState = atom<Gist>({
  key: "myapp.kenichirow.com:gist:current",
});

const currentGistQuery = selector({
  key: "myapp.kenichirow.com:gist:current:query",
  get: async ({ get }) => {
    return get(currentGistState);
  },
});

const currentGistFilesQuery = selector({
  key: "myapp.kenichirow.com:gist:current:files:query",
  get: async ({ get }) => {
    const gist = get(currentGistQuery);
    if (!gist) {
      return;
    }
    const files = Object.entries(gist.files).map(
      async (value: [string, GistFile]) => {
        let file = value[1] as GistFile;
        const raw = await get(rawGisteFile(file.raw_url as string));
        return { ...file, raw: raw };
      }
    );
    return Promise.all(files);
  },
});

const rawGisteFile = selectorFamily<RawGistFile, RawGistFileURL>({
  key: "myapp.kenichirow.com:gists:raw",
  get:
    (fileName) =>
    async ({ get }) => {
      console.log("---------  1234  ---------");
      console.log(fileName);
      if (fileName == "") {
        return "";
      }
      const data = await fetch(fileName)
        .then((res) => res.text())
        .catch((error) => {
          return "";
        });
      return data;
    },
});

type patchGistBody = {
  files: { [filename: string]: { content: string } };
};
const toPatchGistBody = (gistFiles: GistFile[]): patchGistBody => {
  let body: patchGistBody = { files: {} };

  gistFiles.forEach((f: GistFile) => {
    if (f.raw != "") {
      body.files[f.filename] = { content: f.raw || "" };
    }
  });
  return body;
};

const updateGist = useRecoilCallback(
  ({ snapshot, refresh, reset }) =>
    async (updateFiles: GistFile[]) => {
      const gist = await snapshot.getLoadable(currentGistQuery).getValue();
      const githubToken = await snapshot
        .getLoadable(accessTokenQuery)
        .getValue();

      const url = `https://api.github.com/gists/${gist.id}`;

      if (githubToken === "") {
        return Promise.reject();
      }

      const headers = {
        "Content-type": "application/json",
        Authorization: `token ${githubToken}`,
        Accept: "application/vnd.github.v3+json",
      };

      const body = toPatchGistBody(updateFiles);

      return fetch(url, {
        method: "PATCH",
        headers: headers,
        body: JSON.stringify(body),
      }).then(async (res) => {
        if (!res.ok) {
          console.log(res.text());
          return Promise.reject();
        }
        refresh(userGistsQuery);
        updateFiles.forEach((file) => {
          refresh(currentGistFilesQuery);
          refresh(rawGisteFile(file.raw_url as string));
        });
        // gist file をrefleshする
      });
    }
);

const setGist = useRecoilCallback(
  ({ snapshot, set }) =>
    async (gistId: string) => {
      snapshot.getPromise(userGistsQuery).then((gists) => {
        const current = gists.find((g) => g.id == gistId);
        if (current) {
          set(currentGistState, current);
          set(currentGistIdState, current.id);
        }
      });
    }
);

const useUsersGists = () => {
  const gists = useRecoilValueLoadable(userGistsQuery);
  const gist = useRecoilValueLoadable(currentGistQuery);
  const gist2 = useRecoilValueLoadable(currentGistQuery2);
  const gistFiles = useRecoilValueLoadable(currentGistFilesQuery);

  const resetGist = useRecoilCallback(({ reset }) => async () => {
    await reset(currentGistState);
  });
  return { gists, gist2, setGist, gist, gistFiles, resetGist, updateGist };
};

export { useUsersGists };
