import { GitHubUser, useGithubUser } from "../../states/user";
import styles from "../../styles/Header.module.css";
import Link from "next/link";
import React from "react";

const HeaderNavigation: React.FC<{ user: GitHubUser; isLoggedin: boolean }> = ({
  user,
  isLoggedin,
}) => {
  return (
    <div className={styles.navigation}>
      <React.Suspense fallback={<div>loading..</div>}>
        <Link href="/">
          <p>{isLoggedin && user?.login}</p>
        </Link>
      </React.Suspense>
    </div>
  );
};

export { HeaderNavigation };
