import { useEffect } from "react";
import { useRecoilCallback } from "recoil";
import { SideBar } from "../../components/gist/SideBar";
import { Gist, useUsersGists } from "../../states/gist";
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
