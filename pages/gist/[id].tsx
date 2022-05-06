import { SideBar } from "../../components/gist/SideBar";
import { GistDetail } from "../../components/gist/GistDetail";

import { useUsersGists } from "../../states/gist";
import styles from "../../styles/Content.module.css";
import { useRouter } from "next/router";
import { useGithubUser } from "../../states/user";
import { useEffect } from "react";

const GistPage: React.FC = () => {
  const router = useRouter();
  const { user } = useGithubUser();
  const gistId = router.query.id;

  const { gist, setGist } = useUsersGists();
  console.log("here");
  useEffect(() => {
    console.log("set gist start");
    console.log(user);
    console.log(gist);
    if (user.state == "hasValue" && !user.contents) {
      router.replace("/");
    }
    setGist(gistId as string);
    console.log("set gist end");
    if (typeof window !== "undefined") {
      return;
    }
  }, [user, gistId, router]);

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
