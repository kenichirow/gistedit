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
  const { setGist, gist, gistFiles, fetchGistFile } = useGist();
  const { gists, fetchGists } = useGists();

  useEffect(() => {
    (async () => {
      if (user.state !== "hasValue") {
        await login();
      }
    })();

    if (gists.state !== "hasValue") {
      fetchGists()
        .then(() => {
          setGist(gistId);
        })
        .then(fetchGistFile);
    } else {
      setGist(gistId).then(fetchGistFile);
    }
  }, [user, setGist, fetchGists, gists, login, gistId, router, gistFiles]);

  if (gist.state != "hasValue") {
    return <>{"loading.."}</>;
  }

  return (
    <>
      <div className={styles.wrapper}>
        <SideBar />
        <div className={styles.content}>
          <GistDetail gist={gist.contents} gistFiles={gistFiles} />
        </div>
      </div>
    </>
  );
};

export default GistPage;
