import { SideBar } from "../../components/gist/SideBar";
import { GistDetail } from "../../components/gist/GistDetail";

import { Gist } from "../../states/gist";
import styles from "../../styles/Content.module.css";
import Link from "next/link";
import { useRouter } from "next/router";
import { useGithubUser } from "../../states/user";
import { useEffect } from "react";

const GistPage: React.FC<{ gist: Gist }> = ({ gist }) => {
  const router = useRouter();
  const { user } = useGithubUser();
  useEffect(() => {
    if (typeof window !== "undefined") {
      return;
    }
    if (user.state == "hasValue" && !user.contents) {
      router.push("/");
    }
  }, [user, router]);
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
