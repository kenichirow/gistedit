import React, { useCallback, useEffect, useState } from "react";
import { GistFile, useGist, useGists } from "../../states/gist";
import styles from "../../styles/GistDetail.module.css";
import { GistControl } from "./GistControl";
import { GistFileContent } from "./GistFile";

const GistDetail: React.FC<{ gistId: string }> = ({ gistId }) => {
  const { gist, gistFiles, updateGist } = useGist();
  const [localGistFiles, setLocalGistFiles] = useState<GistFile[]>([]);
  const [init, setInit] = useState(false);

  useEffect(() => {
    if (gistFiles.state === "hasValue" && gistFiles.contents) {
      setLocalGistFiles(gistFiles.contents);
      console.log("set");

      setInit(gist.state === "hasValue" && gist.contents.id === gistId);
    } else {
      console.log(gistFiles);
    }
  }, [gist, init, gistFiles, gistId]);

  const onGistFileChange = useCallback(
    (filename: string, content: string) => {
      setLocalGistFiles((localGistFiles) => {
        return localGistFiles.map((f) => {
          if (f.filename === filename) {
            return { ...f, raw: content };
          }
          return f;
        });
      });
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
