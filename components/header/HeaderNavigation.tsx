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
      <Link href="/">
        <p>{isLoggedin && user?.login}</p>
      </Link>
      {isLoggedin && <Link href={"/gist/new"}>{" + "}</Link>}
    </div>
  );
};

export { HeaderNavigation };
