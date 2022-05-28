import React, { useCallback, useEffect, useState } from "react";
import { GistFile, useGist } from "../../states/gist";
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
      setInit(gist.state === "hasValue" && gist.contents.id === gistId);
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

      setLocalGistFiles(localGistFiles.concat([newGistFile]));
    },
    [localGistFiles]
  );

  const onGistUpdate = useCallback(() => {
    setInit(false);
    updateGist(localGistFiles).then(() => {});
  }, [localGistFiles]);

  if (!init) {
    return <div> {"loading..."}</div>;
  }

  return (
    <article className={styles.gistDetail}>
      <GistControl onUpdate={onGistUpdate} onNewGistFile={onNewGistFile} />
      {localGistFiles.map((gistFile) => {
        return <GistFileContent file={gistFile} onChange={onGistFileChange} />;
      })}
    </article>
  );
};

export { GistDetail };
