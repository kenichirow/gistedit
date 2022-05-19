import React, { useCallback, useEffect, useState } from "react";
import { GistFile, useGists3 } from "../../states/gist2";
import styles from "../../styles/GistDetail.module.css";
import { GistControl } from "./GistControl";
import { GistFileContent } from "./GistFile";

const GistDetail: React.FC = () => {
  const { gist, gistFiles, fetchGistFile } = useGists3();
  const [localGistFiles, setLocalGistFiles] = useState<GistFile[]>([]);

  useEffect(() => {
    console.log("use efect");
    if (localGistFiles == []) {
      console.log("fetch gists");
      fetchGistFile().then((res) => {
        console.log(res);
      });
    }

    if (gistFiles.state === "hasValue" && gistFiles.contents) {
      setLocalGistFiles(gistFiles.contents);
    }
  }, [gistFiles, fetchGistFile, localGistFiles]);

  const onGistFileChange = useCallback(
    (filename: string, content: string) => {
      const newFiles = localGistFiles.map((f) => {
        if (f.filename == filename) {
          return { ...f, raw: content };
        }
        return f;
      });
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
    return <div></div>;
  }
};

export { GistDetail };
