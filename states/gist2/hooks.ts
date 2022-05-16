import { useRecoilCallback, useRecoilValueLoadable, waitForAll } from "recoil";
import { accessTokenQuery } from "../access_token";
import { githubUserQuery } from "../user";

import { Gist, GistFile } from "./type";
import {
  gistAtom,
  gistsAtom,
  currentGistIdState,
  currentGistQuery,
  currentGistQuery2,
  currentGistFilesQuery,
  currentGistState,
  rawGisteFile,
  userGistsQuery,
} from "./state";

const useUsersGists = () => {
  const gists = useRecoilValueLoadable(userGistsQuery);
  const gist = useRecoilValueLoadable(currentGistQuery);
  const gist2 = useRecoilValueLoadable(currentGistQuery2);
  const gistFiles = useRecoilValueLoadable(currentGistFilesQuery);

  const resetGist = useRecoilCallback(({ reset }) => async () => {
    await reset(currentGistState);
  });

  const updateGist = useRecoilCallback(
    ({ snapshot, refresh, reset }) =>
      async (updateFiles: GistFile[]) => {
        const gist = await snapshot.getPromise(currentGistQuery);
        const githubToken = await snapshot.getPromise(accessTokenQuery);

        patchGist(githubToken, gist.id, updateFiles).then(async (res) => {
          if (!res.ok) {
            console.log(res.text());
            return Promise.reject();
          }
          refresh(userGistsQuery);
          updateFiles.forEach((file) => {
            refresh(currentGistFilesQuery);
            refresh(rawGisteFile(file.raw_url as string));
          });
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

  return { gists, gist2, setGist, gist, gistFiles, resetGist, updateGist };
};

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

const useGists3 = () => {
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
        const gists2 = res.json();
        return gists2;
      })
      .catch((error) => {
        return error;
      });
    set(gistsAtom, data);
    console.log(data);
    data.forEach((gist: Gist) => {
      console.log(gist);
      set(gistAtom(gist.url), gist);
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
  const setGist = useRecoilCallback(({ snapshot, set }) => (id: string) => {
    return set(currentGistIdState, id);
  });
  return { getGist, getGists, getCurrentGist, fetchGists, setGist };
};

export { useGists3, useUsersGists };
