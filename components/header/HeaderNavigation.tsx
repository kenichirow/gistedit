import { GitHubUser, useGithubUser } from "../../states/user";
import styles from "../../styles/Header.module.css";
import Link from "next/link";
import React from "react";
import { GistFile, useUsersGists } from "../../states/gist";
import { GistList } from "../gist/GistList";

const Gist = () => {
  const { gist } = useUsersGists();
  if (gist.state === "hasValue") {
    const filename = Object.keys(gist.contents.files)[0];
    return (
      <div>
        {" / "} {filename}
      </div>
    );
  } else {
  }

  return <></>;
};

const HeaderNavigation: React.FC = () => {
  const { user } = useGithubUser();
  if (user.state === "hasValue") {
    return (
      <div className={styles.navigation}>
        <Link href="/">
          <p>{user.contents.login}</p>
        </Link>
        <Gist />
        <div>{<Link href={"/gist/new"}>{" + "}</Link>}</div>
      </div>
    );
  } else {
    return <></>;
  }
};

export { HeaderNavigation };
