import {
  atom,
  atomFamily,
  selector,
  selectorFamily,
  useRecoilCallback,
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
        return error;
      });
    return data;
  },
});

const fetchGists = useRecoilCallback(({ snapshot, set }) => async () => {
  const githubToken = await snapshot.getPromise(accessTokenQuery);
  const user = await snapshot.getPromise(githubUserQuery);
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
      return error;
    });

  set(gistsAtom, () => {
    return data;
  });

  data.forEach((gist: Gist) => {
    set(gistAtom(gist.url), () => {
      return gist;
    });
  });
});

export const currentGistIdState = atom<string>({
  key: "myapp.kenichirow.com:gist:current:id",
});

export const gistAtom = atomFamily<Gist, string>({
  key: "myapp.kenichirow.com:gist1",
});

export const gistsAtom = atom<Gist[]>({
  key: "myapp.kenichirow.com:gists2",
});

const setGists = useRecoilCallback(({ set }) => (gists: Gist[]) => {
  // fetch
  set(gistsAtom, () => {
    return gists;
  });
  gists.forEach((gist) => {
    set(gistAtom(gist.url), () => {
      return gist;
    });
  });
});

const getGist = useRecoilCallback(({ snapshot }) => async (id: string) => {
  return snapshot.getPromise(gistAtom(id));
});

const getCurrentGist = useRecoilCallback(({ snapshot }) => () => {
  const id = snapshot.getLoadable(currentGistIdState).getValue();
  return snapshot.getLoadable(gistAtom(id));
});

const getGists = useRecoilCallback(({ snapshot }) => () => {
  return snapshot.getLoadable(gistsAtom);
});

export const currentGistQuery2 = selector({
  key: "myapp.kenichirow.com:gist:current:query2",
  get: async ({ get }) => {
    const f = get(currentGistIdState);
    const x = get(userGistsQuery);
    return x.find((g) => g.id == f);
  },
});

export const currentGistState = atom<Gist>({
  key: "myapp.kenichirow.com:gist:current",
});

export const currentGistQuery = selector<Gist>({
  key: "myapp.kenichirow.com:gist:current:query",
  get: async ({ get }) => {
    return get(currentGistState);
  },
});

export const currentGistFilesQuery = selector({
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

export const rawGisteFile = selectorFamily<RawGistFile, RawGistFileURL>({
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
