import {
  selector,
  useRecoilState,
  RecoilState,
  useResetRecoilState,
  useRecoilValueLoadable,
  selectorFamily,
  atomFamily,
} from "recoil";

import { accessTokenState } from "./access_token";
import { githubUserSelector } from "./user";

export type GistFile = {
  filename: string;
  type: string;
  language: string;
  raw_url: string;
  size: number;
};

export type RawGistFile = string;
export type RawGistFileURL = string;

export type Gist = {
  id: string;
  url: string;
  html_url: string;
  files: {
    [filename: string]: GistFile;
  };
};

type GistError = {
  message: string;
};

const gistState = atomFamily<Gist, string>({
  key: "myapp.kenichirow.com:gists:gist",
  default: {
    id: "",
    url: "",
    html_url: "",
    files: {},
  },
});

const rawGisteFile = selectorFamily<RawGistFile, RawGistFileURL>({
  key: "myapp.kenichirow.com:gists:rawGistfile",
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
  set:
    (fileName) =>
    ({ get, set, reset }) => {},
});

const userGistsState: RecoilState<Gist[] | GistError> = selector({
  key: "myapp.kenichirow.com:gists:Gists",
  get: async ({ get }) => {
    const githubToken = get(accessTokenState);
    const user = get(githubUserSelector);
    console.log(user);
    const url = `https://api.github.com/users/${user.login}/gists`;
    return fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `token ${githubToken}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          console.log("not");
          return res.json();
        }
        console.log("gist fetched");
        return res.json();
      })
      .catch((error) => {
        console.log("error");
        return { message: "error" };
      });
  },
  set: ({ set }, newValue) => {},
});

const useUsersGists = () => {
  const repos = useRecoilValueLoadable(userGistsState);

  return repos;
};

export { useUsersGists };
