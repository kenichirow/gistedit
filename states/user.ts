import { rejects } from "assert";
import { useCallback, useEffect } from "react";
import {
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
  RecoilState,
  useResetRecoilState,
  useRecoilValueLoadable,
  selectorFamily,
  DefaultValue,
  useRecoilStateLoadable,
  useRecoilCallback,
} from "recoil";

import { accessTokenQuery } from "./access_token";

export type GitHubUser = {
  login?: string;
  avatar_url?: string;
  name?: string;
};

export const githubUserState = atom<GitHubUser>({
  key: "myapp.kenichirow.com:user:atom",
});

const githubUserQuery = selector<GitHubUser>({
  key: "myapp.kenichirow.com:user:selector",
  get: async ({ get }) => {
    const a = get(githubUserState);
    if (a) {
      return a;
    }

    if (typeof window !== "undefined") {
      const x = localStorage.getItem("user");
      if (x) {
        return JSON.parse(x);
      } else {
        return new Promise((_, reject) => {
          reject();
        });
      }
    }
    return new Promise((_, reject) => {
      reject();
    });
  },
  set: ({ set, reset }, newValue) => {
    if (typeof window !== "undefined") {
      if (newValue instanceof DefaultValue) {
        localStorage.removeItem("user");
        reset(githubUserState);
        return;
      }
      set(githubUserState, newValue);
      localStorage.setItem("user", JSON.stringify(newValue));
    }
  },
});

const isLoggedinState = atom({
  key: "myapp.kenichirow.com:user:loggedin",
  default: false,
});

export const fetchGithubUser = async (
  accessToken: string
): Promise<GitHubUser> => {
  const url = "https://api.github.com/user";
  const data = await fetch(url, {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: `token ${accessToken}`,
    },
  }).then((res) => {
    if (!res.ok) {
      throw new Error(res.statusText);
    }
    return res.json();
  });
  return data;
};

const useGithubUser = () => {
  const [user, setUser] = useRecoilStateLoadable(githubUserQuery);
  const resetUserState = useResetRecoilState(githubUserQuery);
  const resetAccessToken = useResetRecoilState(accessTokenQuery);
  const [accessToken, _] = useRecoilStateLoadable(accessTokenQuery);
  const [isLoggedin, setIsLoggedIn] = useRecoilState(isLoggedinState);

  const resetUser = useCallback(() => {
    resetAccessToken();
    resetUserState();
  }, [resetUserState, resetAccessToken]);

  //  const resetUser = useRecoilCallback(({ reset }) => async () => {
  //    reset(accessTokenQuery);
  //    reset(githubUserQuery);
  //  });

  const login = useRecoilCallback(
    ({ set, snapshot, reset }) => {
      return async () => {
        if (accessToken.state == "hasValue" && accessToken.contents != "") {
          return fetchGithubUser(accessToken.contents)
            .then((user: GitHubUser) => {
              set(githubUserQuery, user);
            })
            .catch((e) => {
              reset(accessTokenQuery);
              reset(githubUserState);
              return Promise.resolve();
            });
        }
        return Promise.resolve();
      };
    },
    [isLoggedin, accessToken, accessTokenQuery, githubUserState]
  );

  return { user, login, resetUser, setUser };
};

export { useGithubUser, githubUserQuery };
