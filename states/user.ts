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

import { accessTokenState } from "./access_token";

export type GitHubUser = {
  error?: boolean;
  reason?: string;
  login?: string;
};

const githubUserAtom = atom<GitHubUser>({
  key: "myapp.kenichirow.com:user:atom",
  default: { error: true, reason: "not logged in" },
});

const githubUserSelector = selector<GitHubUser>({
  key: "myapp.kenichirow.com:user:selector",
  get: ({ get }) => {
    if (typeof window !== "undefined") {
      const x = localStorage.getItem("user");
      if (x) {
        return JSON.parse(x);
      }
    }
  },
  set: ({ set, reset }, newValue) => {
    if (typeof window !== "undefined") {
      if (newValue instanceof DefaultValue) {
        reset(isLoggedinState);
        //      reset(githubUserAtom);
        localStorage.removeItem("user");
        return;
      }
      set(isLoggedinState, true);
      //    set(githubUserAtom, newValue);
      localStorage.setItem("user", JSON.stringify(newValue));
    }
  },
});

const isLoggedinState = atom({
  key: "myapp.kenichirow.com:user:loggedin",
  default: false,
});

const fetchGithubUser = async (accessToken: string): Promise<GitHubUser> => {
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
  const [user, setUser] = useRecoilStateLoadable(githubUserSelector);
  const resetUserState = useResetRecoilState(githubUserSelector);
  const resetAccessToken = useResetRecoilState(accessTokenState);
  const accessToken = useRecoilValue(accessTokenState);
  const [isLoggedin, setIsLoggedIn] = useRecoilState(isLoggedinState);

  const resetUser = useCallback(() => {
    resetAccessToken();
    resetUserState();
  }, [resetUserState, resetAccessToken]);

  const login = useCallback(async () => {
    if (accessToken) {
      console.log(accessToken);
      console.log(isLoggedin);
      return fetchGithubUser(accessToken)
        .then((user: GitHubUser) => {
          console.log(`set user ${JSON.stringify(user)}`);
          setUser(user);
        })
        .catch((e) => {
          resetAccessToken();
          resetUserState();
        });
    }
    return new Promise((resolve, reject) => {
      resolve("noop");
    });
  }, [isLoggedin, accessToken, setUser, resetUserState, resetAccessToken]);

  return { user, login, resetUser };
};

export { useGithubUser, githubUserSelector };
