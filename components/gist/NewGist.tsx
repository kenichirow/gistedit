import React, { useCallback, useEffect, useState } from "react";
import { Gist, GistFile, useGist } from "../../states/gist";
import styles from "../../styles/GistDetail.module.css";
import { GistControl } from "./GistControl";
import { GistFileContent } from "./GistFile";
import { Loadable } from "recoil";
import { imageConfigDefault } from "next/dist/shared/lib/image-config";

type NewGistPros = {
  gistFiles: GistFile[];
};

const NewGist: React.FC<NewGistPros> = ({ gistFiles }) => {
  const { updateGist, deleteGist } = useGist();
  const [localGistFiles, setLocalGistFiles] = useState<GistFile[]>([]);

  useEffect(() => {
    setLocalGistFiles(gistFiles);
  }, [gistFiles]);

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

  const onDeleteGistFile = useCallback(() => {}, []);

  const onGistUpdate = useCallback(() => {
    updateGist(localGistFiles).then(() => {});
  }, [localGistFiles]);

  return (
    <article className={styles.gistDetail}>
      <GistControl onUpdate={onGistUpdate} onNewGistFile={onNewGistFile} />
      {localGistFiles.map((gistFile) => {
        return <GistFileContent file={gistFile} onChange={onGistFileChange} />;
      })}
    </article>
  );
};

export { NewGist };
