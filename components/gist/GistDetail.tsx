import { json } from "node:stream/consumers";
import React, { useCallback, useEffect, useState } from "react";
import { useAccessTokenState } from "../../states/access_token";
import { useUsersGists, GistFile } from "../../states/gist";
import styles from "../../styles/GistDetail.module.css";
import { GistControl } from "./GistControl";

const GistFile: React.FC<{ file: GistFile }> = ({ file }) => {
  return (
    <div key={file.filename}>
      <h2>{file.filename}</h2>
      <p>
        {file.size}
        {"b"}
      </p>
      <p>{file.language}</p>
      <textarea className={styles.gistCode} value={file.raw} />
    </div>
  );
};

const GistDetail: React.FC = () => {
  const { gist, gistFiles } = useUsersGists();
  const [gistRawfile, setGistRawfile] = useState<string>("loading..");

  const onGistChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setGistRawfile(e.target.value);
    },
    []
  );

  const { accessToken } = useAccessTokenState();

  const onGistUpdate = useCallback(() => {
    // const url = `https://api.github.com/gists/${gist.contents.id}`;
    // const headers = {
    //   "Content-type": "application/json",
    //   Authorization: `token ${accessToken}`,
    //   Accept: "application/vnd.github.v3+json",
    // };
    // const body = {
    //   files: { [gistFile?.filename as string]: { content: gistRawfile } },
    // };
    // (async () => {
    //   fetch(url, {
    //     method: "PATCH",
    //     headers: headers,
    //     body: JSON.stringify(body),
    //   }).then((res) => {
    //     console.log(res.json());
    //   });
    // })();
  }, [accessToken, gistRawfile, gist]);

  if (gist.state == "hasValue" && gistFiles.state == "hasValue") {
    return (
      <article className={styles.gistDetail}>
        {gistFiles.contents &&
          gistFiles.contents.map((gistFile) => {
            return <GistFile file={gistFile} />;
          })}
      </article>
    );
  } else {
    return <div>loading..</div>;
  }
};

export { GistDetail };
