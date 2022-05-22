import React, { useCallback, useEffect, useState } from "react";
import { GistFile, useGist, useGists } from "../../states/gist";
import styles from "../../styles/GistDetail.module.css";
import { GistControl } from "./GistControl";
import { GistFileContent } from "./GistFile";

const GistDetail: React.FC<{ gistId: string }> = ({ gistId }) => {
  const { gist, gistFiles, updateGist, fetchGistFile } = useGist();
  const [initialized, setInitialized] = useState(false);
  const [localGistFiles, setLocalGistFiles] = useState<GistFile[]>([]);

  useEffect(() => {
    if (gistFiles.state === "hasValue" && gistFiles.contents) {
      if (!initialized) {
        setLocalGistFiles(gistFiles.contents);
        setInitialized(true);
      }
    }
    fetchGistFile();
  }, [gistFiles, fetchGistFile, initialized]);

  const onGistFileChange = useCallback(
    (filename: string, content: string) => {
      const newFiles = localGistFiles.map((f) => {
        if (f.filename == filename) {
          return { ...f, raw: content };
        }
        return f;
      });
      console.log(newFiles);
      setLocalGistFiles(newFiles);
    },
    [localGistFiles]
  );

  const onNewGistFile = useCallback(
    (filename: string) => {
      const newGistFile = {
        filename: filename,
        content: "",
        raw: "",
      };

      setLocalGistFiles(localGistFiles.concat([newGistFile]).reverse());
    },
    [localGistFiles]
  );

  const onGistUpdate = useCallback(() => {
    updateGist(localGistFiles);
  }, [localGistFiles]);

  if (gist.state == "hasValue" && gistFiles.state == "hasValue") {
    return (
      <article className={styles.gistDetail}>
        <GistControl onUpdate={onGistUpdate} onNewGistFile={onNewGistFile} />
        {localGistFiles.map((gistFile) => {
          return (
            <GistFileContent file={gistFile} onChange={onGistFileChange} />
          );
        })}
      </article>
    );
  } else {
    return <div> {"loading..."}</div>;
  }
};

export { GistDetail };
