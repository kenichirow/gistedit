import { useRecoilCallback, useRecoilValueLoadable } from "recoil";
import { accessTokenQuery } from "../access_token";
import { githubUserQuery } from "../user";

import { Gist, GistFile } from "./type";
import {
  gistAtom,
  gistsAtom,
  gistFileRawAtom,
  currentGistIdAtom,
  currentGistQuery,
  currentGistFilesQuery,
} from "./state";

/**
 * useGist
 *
 * Gist単体の状態と取得
 */
const useGist = () => {
  const gist = useRecoilValueLoadable(currentGistQuery);
  const gistFiles = useRecoilValueLoadable(currentGistFilesQuery);

  /**
   * updateGist
   * gist fileの更新
   */
  const updateGist = useRecoilCallback(
    ({ snapshot, set }) =>
      async (updateFiles: GistFile[]) => {
        console.log("-----------");
        console.log(updateFiles);
        const gist = snapshot.getLoadable(currentGistQuery).getValue();
        const githubToken = snapshot.getLoadable(accessTokenQuery).getValue();

        return patchGist(githubToken, gist.id, updateFiles)
          .then(async (res) => {
            if (!res.ok) {
              return Promise.reject();
            }
            return res.json();
          })
          .then((updatedGist) => {
            set(gistAtom(gist.id), updatedGist);
          });
      }
  );

  const fetchGistFile = useRecoilCallback(
    ({ snapshot, set, refresh }) =>
      async () => {
        const id = snapshot.getLoadable(currentGistIdAtom).getValue();
        const gist = snapshot.getLoadable(gistAtom(id)).getValue();

        const rawfilesRequests = Object.keys(gist.files).map((key) => {
          const file = gist.files[key];
          const url = file.raw_url as string;
          return fetch(url)
            .then((res) => res.text())
            .then((data) => {
              set(gistFileRawAtom(file.filename), data);
              return file.filename;
            });
        });

        return Promise.all(rawfilesRequests).then((filenames) => {});
      }
  );

  const setGist = useRecoilCallback(({ set }) => async (gistId: string) => {
    set(currentGistIdAtom, gistId);
  });

  return {
    gist,
    gistFiles,
    setGist,
    fetchGistFile,
    updateGist,
  };
};

/**
 * useGists
 *
 * Gistのリスト
 */
const useGists = () => {
  const gists = useRecoilValueLoadable(gistsAtom);

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
    data.forEach((gist: Gist) => {
      set(gistAtom(gist.id), gist);
    });
  });

  return {
    gists,
    fetchGists,
  };
};

const patchGist = (
  githubToken: string,
  gistId: string,
  updateFiles: GistFile[]
) => {
  const url = `https://api.github.com/gists/${gistId}`;

  console.log(updateFiles);

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

export { useGists, useGist };
