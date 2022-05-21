export type GistFile = {
  filename: string;
  type?: string;
  language?: string;
  raw_url?: string;
  raw?: string;
  size?: number;
};

export type RawGistFile = string;
export type RawGistFileURL = string;

export type Gist = {
  id: string;
  url: string;
  html_url: string;
  files_list?: GistFile[];
  files: {
    [filename: string]: GistFile;
  };
};
