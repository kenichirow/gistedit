import {
  atom,
  atomFamily,
  selector,
  selectorFamily,
  useRecoilCallback,
} from "recoil";

import { Gist, GistFile, RawGistFile, RawGistFileURL } from "./type";
import { accessTokenQuery } from "../access_token";
import { githubUserQuery } from "../user";

export const currentGistIdState = atom<string>({
  key: "myapp.kenichirow.com:gist:current:id",
});

export const gistAtom = atomFamily<Gist, string>({
  key: "myapp.kenichirow.com:gist1",
});

export const gistsAtom = atom<Gist[]>({
  key: "myapp.kenichirow.com:gists2",
});

export const currentGistQuery = selector({
  key: "myapp.kenichirow.com:gist:current:query3",
  get: async ({ get }) => {
    const f = get(currentGistIdState);
    return get(gistAtom(f));
  },
});

export const currentGistState = atom<Gist>({
  key: "myapp.kenichirow.com:gist:current",
});

export const gistFileAtom = atomFamily<Gist, string>({
  key: "myapp.kenichirow.com:gist:file:1",
});

export const gistFileRawAtom = atomFamily<string, string>({
  key: "myapp.kenichirow.com:gist:file:raw:1",
});

export const currentGistFilesQuery = selector({
  key: "myapp.kenichirow.com:gist:current:files:query",
  get: async ({ get }) => {
    const gist = get(currentGistQuery);
    if (!gist) {
      return;
    }
    const files = Object.entries(gist.files).map(
      async (value: [string, GistFile]) => {
        let file = value[1] as GistFile;
        const raw = await get(rawGisteFile(file.raw_url as string));
        return { ...file, raw: raw };
      }
    );
    return Promise.all(files);
  },
});

export const rawGisteFile = selectorFamily<RawGistFile, RawGistFileURL>({
  key: "myapp.kenichirow.com:gists:raw",
  get:
    (fileName) =>
    async ({ get }) => {
      if (fileName == "") {
        return "";
      }
      const data = await fetch(fileName)
        .then((res) => res.text())
        .catch((error) => {
          return "";
        });
      return data;
    },
});
