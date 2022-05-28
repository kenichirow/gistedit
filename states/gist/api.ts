import { Gist, GistFile } from "./type";

const newGist = (githubToken: string, updateFiles: GistFile[]) => {
  const url = `https://api.github.com/gists/`;

  const headers = {
    "Content-type": "application/json",
    Authorization: `token ${githubToken}`,
    Accept: "application/vnd.github.v3+json",
  };

  const body = toGistsFileBody(updateFiles);

  return fetch(url, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(body),
  });
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

  const body = toGistsFileBody(updateFiles);

  return fetch(url, {
    method: "PATCH",
    headers: headers,
    body: JSON.stringify(body),
  });
};

const deleteGist = (githubToken: string, gistId: string) => {
  const url = `https://api.github.com/gists/${gistId}`;

  const headers = {
    "Content-type": "application/json",
    Authorization: `token ${githubToken}`,
    Accept: "application/vnd.github.v3+json",
  };

  return fetch(url, {
    method: "DELETE",
    headers: headers,
  });
};

type patchGistBody = {
  files: { [filename: string]: { content: string } };
};

const toGistsFileBody = (gistFiles: GistFile[]): patchGistBody => {
  let body: patchGistBody = { files: {} };

  gistFiles.forEach((f: GistFile) => {
    if (f.raw != "") {
      body.files[f.filename] = { content: f.raw || "" };
    }
  });
  return body;
};

export default {
  patch: patchGist,
  new: newGist,
  delete: deleteGist,
};
