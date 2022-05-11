import { useEffect } from "react";
import { useUsersGists } from "../../states/gist/gist";
import { Gist } from "../../states/gist/type";

import styles from "../../styles/Content.module.css";

const GistPage: React.FC<{ gist: Gist }> = ({ gist }) => {
  const { resetGist } = useUsersGists();
  useEffect(() => {
    resetGist();
  });
  return (
    <>
      <div className={styles.wrapper}>
        <div className={styles.content}></div>
      </div>
    </>
  );
};

export default GistPage;
