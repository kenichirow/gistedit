import { SideBar } from "../../components/gist/SideBar";
import { GistDetail } from "../../components/gist/GistDetail";

import { useUsersGists } from "../../states/gist";
import styles from "../../styles/Content.module.css";
import { useRouter } from "next/router";
import { useGithubUser } from "../../states/user";
import { useEffect } from "react";

const GistPage: React.FC = () => {
  const router = useRouter();
  const gistId = router.query.id as string;

  const { login, user } = useGithubUser();
  const { setGist } = useUsersGists();

  useEffect(() => {
    (async () => {
      if (user.state != "hasValue") {
        await login();
      }
    })();

    setGist(gistId);
  }, [user, login, gistId, router]);

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
