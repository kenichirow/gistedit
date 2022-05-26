import { Gist } from "../../states/gist";

import styles from "../../styles/Content.module.css";

const GistPage: React.FC<{ gist: Gist }> = ({ gist }) => {
  return (
    <>
      <div className={styles.wrapper}>
        <div className={styles.content}></div>
      </div>
    </>
  );
};

export default GistPage;
