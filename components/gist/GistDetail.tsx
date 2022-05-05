import { useRouter } from "next/router";
import { json } from "node:stream/consumers";
import React, { useCallback, useEffect, useState } from "react";
import { useAccessTokenState } from "../../states/access_token";
import { Gist, useUsersGists, GistFile } from "../../states/gist";
import styles from "../../styles/GistDetail.module.css";
import { GistControl } from "./GistControl";

const getGistFiles = (gist: Gist) => {
  return Object.entries(gist.files).map(
    (value: [string, GistFile], index: number) => {
      return { filename: value[0], files: value[1] };
    }
  )[0];
};

const fetchGistRawFile = async (url: string) => {
  return fetch(url)
    .then((res) => res.text())
    .then((data) => {
      return data;
    });
};

const GistDetail: React.FC = () => {
  const {
    query: { id },
  } = useRouter();
  const gistsLoadable = useUsersGists();
  const [gist, setGist] = useState<Gist>();
  const [gistFile, setGistfile] = useState<GistFile>();
  const [gistRawfile, setGistRawfile] = useState<string>("loading..");

  const onGistChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setGistRawfile(e.target.value);
    },
    []
  );

  const { accessToken } = useAccessTokenState();

  const onGistUpdate = useCallback(() => {
    const url = `https://api.github.com/gists/${gist?.id}`;
    const headers = {
      "Content-type": "application/json",
      Authorization: `token ${accessToken}`,
      Accept: "application/vnd.github.v3+json",
    };
    const body = {
      files: { [gistFile?.filename as string]: { content: gistRawfile } },
    };

    (async () => {
      fetch(url, {
        method: "PATCH",
        headers: headers,
        body: JSON.stringify(body),
      }).then((res) => {
        console.log(res.json());
      });
    })();
  }, [accessToken, gistRawfile, gistFile, gist]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const gists = gistsLoadable.contents as Gist[];
    if (gistsLoadable.state == "hasValue") {
      const gist = gists.find((gist) => gist.id == id);
      const { filename, files } = getGistFiles(gist as Gist);
      setGist(gist);
      setGistfile(files);
      (async () => {
        const x = await fetchGistRawFile(files.raw_url);
        setGistRawfile(x);
      })();
    }
  }, [id, gistsLoadable]);

  if (gistsLoadable.state != "hasValue") {
    return <div>loading..</div>;
  }

  return (
    <article className={styles.gistDetail}>
      <h2>{gistFile?.filename}</h2>
      <p>{gist?.html_url}</p>
      <p>
        {gistFile?.size}
        {"b"}
      </p>
      <p>{gistFile?.language}</p>
      <GistControl onUpdate={onGistUpdate} />
      <textarea
        onChange={onGistChange}
        className={styles.gistCode}
        value={gistRawfile}
      />
    </article>
  );
};

export { GistDetail };
