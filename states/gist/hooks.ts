import {
  snapshot_UNSTABLE,
  useRecoilCallback,
  useRecoilValueLoadable,
  waitForAll,
} from "recoil";
import { accessTokenQuery } from "../access_token";
import { githubUserQuery } from "../user";

import { Gist, GistFile } from "./type";
import {
  gistAtom,
  gistsAtom,
  gistFileRawAtom,
  currentGistIdState,
  currentGistQuery,
  currentGistFilesQuery,
  currentGistState,
} from "./state";

/**
 * useGist
 *
 * Gist単体の状態と取得
 */
const useGist = () => {
  const gist = useRecoilValueLoadable(currentGistQuery);
  const gistFiles = useRecoilValueLoadable(currentGistFilesQuery);

  const resetGist = useRecoilCallback(({ reset }) => async () => {
    await reset(currentGistState);
  });

  const updateGist = useRecoilCallback(
    ({ snapshot, refresh, reset }) =>
      async (updateFiles: GistFile[]) => {
        const gist = snapshot.getLoadable(currentGistQuery).getValue();
        const githubToken = snapshot.getLoadable(accessTokenQuery).getValue();

        patchGist(githubToken, gist.id, updateFiles).then(async (res) => {
          if (!res.ok) {
            console.log(res.text());
            return Promise.reject();
          }
          refresh(gistsAtom);
          updateFiles.forEach((file) => {
            refresh(currentGistFilesQuery);
          });
        });
      }
  );

  const fetchGistFile = useRecoilCallback(({ snapshot, set }) => async () => {
    console.log("fetch gist!!!!!");
    const id = snapshot.getLoadable(currentGistIdState).getValue();
    console.log(id);
    const gist = snapshot.getLoadable(gistAtom(id)).getValue();
    console.log(gist);
    const rawfiles = Object.keys(gist.files).map((key) => {
      const g = gist.files[key];
      const url = g.raw_url as string;
      return fetch(url)
        .then((res) => res.text())
        .then((data) => {
          set(gistFileRawAtom(g.filename), data);
        });
    });

    await Promise.all(rawfiles);
  });

  const setGist = useRecoilCallback(
    ({ snapshot, set }) =>
      async (gistId: string) => {
        snapshot
          .getPromise(gistsAtom)
          .then((gists) => {
            console.log("set Gist");
            console.log("current");
            const current = gists.find((g) => g.id == gistId);
            if (current) {
              set(currentGistState, current);
              set(currentGistIdState, current.id);
            }
          })
          .catch((e) => {
            console.log(e);
          });
      }
  );

  return {
    gist,
    gistFiles,
    setGist,
    fetchGistFile,
    resetGist,
    updateGist,
  };
};

/**
 * useGists
 *
 * Gistのリスト
 */
const useGists = () => {
  const gist = useRecoilValueLoadable(currentGistState);
  const gists = useRecoilValueLoadable(gistsAtom);
  const gistFiles = useRecoilValueLoadable(currentGistFilesQuery);

  const fetchGists = useRecoilCallback(({ snapshot, set }) => async () => {
    const githubToken = await snapshot.getPromise(accessTokenQuery);
    const user = await snapshot.getPromise(githubUserQuery);
    const url = `https://api.github.com/users/${user.login}/gists`;
    console.log("fetchGists");
    const data = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `token ${githubToken}`,
      },
    })
      .then((res) => {
        console.log("-->>>");
        if (!res.ok) {
          console.log("ERR");
          return Promise.reject();
        }
        const gists2 = res.json();
        return gists2;
      })
      .catch((error) => {
        console.log("ERR");
        return error;
      });
    set(gistsAtom, data);
    console.log(data);
    data.forEach((gist: Gist) => {
      set(gistAtom(gist.id), gist);
    });
  });

  const setGist = useRecoilCallback(({ set }) => (id: string) => {
    return set(currentGistIdState, id);
  });

  return {
    gist,
    gists,
    gistFiles,
    fetchGists,
    setGist,
  };
};

export { useGists, useGist };

const patchGist = (
  githubToken: string,
  gistId: string,
  updateFiles: GistFile[]
) => {
  const url = `https://api.github.com/gists/${gistId}`;

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
  });
};

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
