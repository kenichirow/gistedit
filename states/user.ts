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
  get: async ({ get }) => {
    if (typeof window !== "undefined") {
      const x = localStorage.getItem("user");
      if (x) {
        return JSON.parse(x);
      } else {
        return;
      }
    } else {
      return new Promise((resolve, reject) => {
        reject();
      });
    }
  },
  set: ({ set, reset }, newValue) => {
    if (typeof window !== "undefined") {
      if (newValue instanceof DefaultValue) {
        localStorage.removeItem("user");
        reset(githubUserAtom);
        return;
      }
      set(githubUserAtom, newValue);
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
  const [user, setUser] = useRecoilStateLoadable(githubUserSelector);
  const resetUserState = useResetRecoilState(githubUserSelector);
  const resetAccessToken = useResetRecoilState(accessTokenState);
  const [accessToken, _] = useRecoilStateLoadable(accessTokenState);
  const [isLoggedin, setIsLoggedIn] = useRecoilState(isLoggedinState);

  const resetUser = useCallback(() => {
    resetAccessToken();
    resetUserState();
  }, [resetUserState, resetAccessToken]);

  //  const login = useCallback(async () => {
  //    console.log("LOG IN");
  //    if (accessToken.state == "hasValue" && accessToken.contents != "") {
  //      console.log(accessToken);
  //      console.log(isLoggedin);
  //      return fetchGithubUser(accessToken.contents)
  //        .then((user: GitHubUser) => {
  //          console.log(`set user ${JSON.stringify(user)}`);
  //          setUser(user);
  //        })
  //        .catch((e) => {
  //          resetAccessToken();
  //          resetUserState();
  //        });
  //    }
  //    return new Promise((resolve, reject) => {
  //      resolve("noop");
  //    });
  //  }, [isLoggedin, accessToken, setUser, resetUserState, resetAccessToken]);

  useEffect(() => {
    if (accessToken.state == "hasValue" && accessToken.contents != "") {
      console.log(`User sttate: ${user.state}`);
      if (user.state != "hasValue") {
        fetchGithubUser(accessToken.contents)
          .then((user: GitHubUser) => {
            setUser(user);
          })
          .catch((e) => {
            resetAccessToken();
            resetUserState();
          });
      }
    }
  }, [accessToken, setUser, resetAccessToken, resetUserState]);

  const login = useRecoilCallback(
    ({ set, snapshot }) => {
      console.log("-----------");
      console.log("-----------");
      return async () => {
        if (accessToken.state == "hasValue" && accessToken.contents != "") {
          console.log("found access token and try fetch user");
          return fetchGithubUser(accessToken.contents)
            .then((user: GitHubUser) => {
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
      };
    },
    [isLoggedin, accessToken, setUser, resetUserState, resetAccessToken]
  );

  return { user, login, resetUser, setUser };
};

export { useGithubUser, githubUserSelector };
