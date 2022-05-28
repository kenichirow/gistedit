import { useCallback, useState } from "react";
import { GistFileContent } from "../../components/gist/GistFile";
import { Gist, GistFile as GistFileType } from "../../states/gist";
import styles from "../../styles/Content.module.css";

const defaultGistFile = {
  filename: "",
};

const NewGistPage: React.FC<{ gist: Gist }> = ({ gist }) => {
  const [gistFiles, setGistFiles] = useState<GistFileType[]>([defaultGistFile]);
  const onGistFileChange = useCallback(
    (filename: string, content: string) => {},
    []
  );
  return (
    <>
      <div className={styles.wrapper}>
        <div className={styles.content}></div>
        {gistFiles.map((gistFile) => (
          <GistFileContent file={gistFile} onChange={onGistFileChange} />
        ))}
      </div>
    </>
  );
};

export default NewGistPage;
