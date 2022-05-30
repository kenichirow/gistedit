import React, { useCallback, useEffect, useState } from "react";
import { Gist, GistFile, useGist } from "../../states/gist";
import styles from "../../styles/GistDetail.module.css";
import { GistControl } from "./GistControl";
import { GistFileContent } from "./GistFile";
import { Loadable } from "recoil";
import { imageConfigDefault } from "next/dist/shared/lib/image-config";

type GistDetailProps = {
  gist: Gist;
  gistFiles: Loadable<GistFile[]>;
};

const GistDetail: React.FC<GistDetailProps> = ({ gist, gistFiles }) => {
  const { updateGist, deleteGist } = useGist();
  const [localGistFiles, setLocalGistFiles] = useState<GistFile[]>([]);

  useEffect(() => {
    console.log(gistFiles);
    if (gistFiles.state == "hasValue") {
      setLocalGistFiles(gistFiles.contents);
    }
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

  const onDeleteGistFile = useCallback(() => {
    deleteGist(gist.id).then(() => {
      console.log("delete!");
    });
  }, [gist]);

  const onGistUpdate = useCallback(() => {
    updateGist(localGistFiles).then(() => {});
  }, [localGistFiles]);

  return (
    <article className={styles.gistDetail}>
      <GistControl
        onUpdate={onGistUpdate}
        onNewGistFile={onNewGistFile}
        onDelete={onDeleteGistFile}
      />
      {localGistFiles.map((gistFile) => {
        return <GistFileContent file={gistFile} onChange={onGistFileChange} />;
      })}
    </article>
  );
};

export { GistDetail };
