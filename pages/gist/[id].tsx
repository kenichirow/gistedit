import { useEffect } from "react";
import { useRouter } from "next/router";

import { SideBar } from "../../components/gist/SideBar";
import { GistDetail } from "../../components/gist/GistDetail";
import { useGithubUser } from "../../states/user";
import { useUsersGists } from "../../states/gist/gist";

import styles from "../../styles/Content.module.css";

const GistPage: React.FC = () => {
  const router = useRouter();
  const gistId = router.query.id as string;

  const { login, user } = useGithubUser();
  const { setGist, gist2 } = useUsersGists();

  useEffect(() => {
    console.log(gist2.contents);
    (async () => {
      if (user.state !== "hasValue") {
        await login();
      }
    })();

    setGist(gistId);
  }, [user, gist2, login, gistId, router]);

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
