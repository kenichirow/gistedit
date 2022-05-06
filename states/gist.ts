import {
  atom,
  selector,
  selectorFamily,
  atomFamily,
  DefaultValue,
  useRecoilCallback,
  useRecoilValue,
  useRecoilValueLoadable,
  useSetRecoilState,
} from "recoil";

import { accessTokenQuery } from "./access_token";
import { githubUserSelector } from "./user";

export type GistFile = {
  filename: string;
  type: string;
  language: string;
  raw_url: string;
  raw?: string;
  size: number;
};

export type RawGistFile = string;
export type RawGistFileURL = string;

export type Gist = {
  id: string;
  url: string;
  html_url: string;
  files_list?: GistFile[];
  files: {
    [filename: string]: GistFile;
  };
};

export const userGistsQuery = selector<Array<Gist>>({
  key: "myapp.kenichirow.com:gist:gists",
  get: async ({ get }) => {
    console.log("get user gists");
    const githubToken = await get(accessTokenQuery);
    console.log(githubToken);
    const user = await get(githubUserSelector);
    console.log("user...");
    console.log(user);
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
          console.log;
          // TODO throw してUIハンドリング
          return new Promise((resolve, reject) => {
            reject();
          });
        }
        return res.json();
      })
      .catch((error) => {
        return new Promise((resolve, reject) => {
          reject();
        });
      });
    return data;
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
    const gist = get(currentGistState);
    if (!gist) {
      return;
    }
    const files = Object.entries(gist.files).map(
      async (value: [string, GistFile]) => {
        let file = value[1] as GistFile;
        const raw = await get(rawGisteFile(file.raw_url));
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
    ({ get }) => {
      if (fileName == "") {
        return "";
      }
      return fetch(fileName)
        .then((res) => res.text())
        .then((data) => {
          return data;
        });
    },
});

const useUsersGists = () => {
  const gists = useRecoilValueLoadable(userGistsQuery);
  const gist = useRecoilValueLoadable(currentGistQuery);
  const gistFiles = useRecoilValueLoadable(currentGistFilesQuery);
  const setGist = useRecoilCallback(
    ({ snapshot, set }) =>
      async (gistId: string) => {
        const gists: Gist[] = await snapshot.getLoadable(userGistsQuery)
          .contents;
        const current = gists.find((g) => {
          return g.id == gistId;
        });
        if (current) {
          set(currentGistState, current);
        }
      }
  );
  const resetGist = useRecoilCallback(({ reset }) => () => {
    reset(currentGistState);
  });
  return { gists, setGist, gist, gistFiles, resetGist };
};

export { useUsersGists };
