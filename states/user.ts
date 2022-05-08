import {
  atom,
  selector,
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
        return Promise.resolve();
      }
    }
    return Promise.resolve();
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

  const logout = useRecoilCallback(
    ({ reset }) =>
      async (callback: () => void) => {
        await reset(accessTokenQuery);
        await reset(githubUserQuery);
        await callback();
      }
  );

  const login = useRecoilCallback(({ set, snapshot, reset }) => {
    return async () => {
      return snapshot.getPromise(accessTokenQuery).then((token) => {
        if (token != "") {
          return fetchGithubUser(token)
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
      });
    };
  });

  return { user, login, logout, setUser };
};

export { useGithubUser, githubUserQuery };
