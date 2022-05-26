import { atom, atomFamily, selector } from "recoil";

import { Gist, GistFile, RawGistFile } from "./type";

export const currentGistIdAtom = atom<string>({
  key: "myapp.kenichirow.com:gist:current:id",
});

export const gistAtom = atomFamily<Gist, string>({
  key: "myapp.kenichirow.com:gist1",
});

export const gistsAtom = atom<Gist[]>({
  key: "myapp.kenichirow.com:gists2",
});

export const currentGistQuery = selector<Gist>({
  key: "myapp.kenichirow.com:gist:current:query3",
  get: async ({ get }) => {
    const f = get(currentGistIdAtom);
    return get(gistAtom(f));
  },
});

export const gistFileAtom = atomFamily<Gist, string>({
  key: "myapp.kenichirow.com:gist:file",
});

export const gistFileRawAtom = atomFamily<RawGistFile, string>({
  key: "myapp.kenichirow.com:gist:file:raw",
});

export const currentGistFilesQuery = selector<GistFile[]>({
  key: "myapp.kenichirow.com:gist:current:files:query",
  get: async ({ get }) => {
    const gist = get(currentGistQuery);
    const files = Object.keys(gist.files).map((filename) => {
      const f = gist.files[filename];
      const raw = get(gistFileRawAtom(f.filename as string));
      return { ...f, raw: raw };
    });
    return files;
  },
});
