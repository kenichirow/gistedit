import { SideBar } from "../../components/gist/SideBar";
import { Gist } from "../../states/gist";
import styles from "../../styles/Content.module.css";

const GistPage: React.FC<{ gist: Gist }> = ({ gist }) => {
  return (
    <>
      <div className={styles.wrapper}>
        <SideBar />
        <div className={styles.content}></div>
      </div>
    </>
  );
};

export default GistPage;
