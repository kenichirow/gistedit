import { useCallback, useState } from "react";
import { GistFileContent } from "../../components/gist/GistFile";
import { NewGist } from "../../components/gist/NewGist";
import { Gist, GistFile as GistFileType } from "../../states/gist";
import styles from "../../styles/Content.module.css";
import { SideBar } from "../../components/gist/SideBar";
const defaultGistFile = {
  filename: "",
};

const defaultNewGist = {};

const NewGistPage: React.FC<{ gist: Gist }> = ({ gist }) => {
  const [gistFiles, setGistFiles] = useState<GistFileType[]>([defaultGistFile]);
  const onGistFileChange = useCallback(
    (filename: string, content: string) => {},
    []
  );
  return (
    <div className={styles.wrapper}>
      <SideBar />
      <div className={styles.content}>
        <NewGist gistFiles={gistFiles} />
      </div>
    </div>
  );
};

export default NewGistPage;
