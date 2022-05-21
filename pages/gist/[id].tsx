import { useEffect } from "react";
import { useRouter } from "next/router";

import { SideBar } from "../../components/gist/SideBar";
import { GistDetail } from "../../components/gist/GistDetail";
import { useGithubUser } from "../../states/user";
import { useGist, useGists } from "../../states/gist";

import styles from "../../styles/Content.module.css";

const GistPage: React.FC = () => {
  const router = useRouter();
  const gistId = router.query.id as string;

  const { login, user } = useGithubUser();
  const { setGist, gist } = useGist();
  const { gists, fetchGists } = useGists();

  useEffect(() => {
    (async () => {
      if (user.state !== "hasValue") {
        await login();
      }
    })();
    console.log(gistId);

    if (gists.state != "hasValue") {
      console.log("fetch gists start");
      fetchGists()
        .then(() => {
          setGist(gistId);
        })
        .catch(() => {
          console.log("ER");
        });
    } else {
      console.log("else fetch gists start");
      setGist(gistId);
    }
    console.log(gistId);
  }, [user, setGist, fetchGists, gists, login, gistId, router]);

  if (gist.state != "hasValue") {
    return <>{"loading.."}</>;
  }

  return (
    <>
      <div className={styles.wrapper}>
        <SideBar />
        <div className={styles.content}>
          <GistDetail gistId={gistId} />
        </div>
      </div>
    </>
  );
};

export default GistPage;
