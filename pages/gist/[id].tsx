import { useEffect } from "react";
import { useRouter } from "next/router";

import { SideBar } from "../../components/gist/SideBar";
import { GistDetail } from "../../components/gist/GistDetail";
import { useGithubUser } from "../../states/user";
import { useGists3 } from "../../states/gist2";

import styles from "../../styles/Content.module.css";

const GistPage: React.FC = () => {
  const router = useRouter();
  const gistId = router.query.id as string;

  const { login, user } = useGithubUser();
  const { setGist, getCurrentGist } = useGists3();

  useEffect(() => {
    (async () => {
      if (user.state !== "hasValue") {
        await login();
      }
    })();

    setGist(gistId);
  }, [user, login, gistId, router]);

  if (getCurrentGist().state == "hasValue") {
    return <></>;
  }

  return (
    <>
      <div className={styles.wrapper}>
        <SideBar />
        <div className={styles.content}>
          <GistDetail />
        </div>
      </div>
    </>
  );
};

export default GistPage;
