import { useGithubUser } from "../../states/user";
import styles from "../../styles/Header.module.css";
import Link from "next/link";
import React from "react";
import { useUsersGists } from "../../states/gist";

const Gist = () => {
  const { gist } = useUsersGists();
  if (gist.state === "hasValue") {
    const filename = Object.keys(gist.contents.files)[0];
    return (
      <p>
        {":"}
        {filename}
      </p>
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
        <div>{<Link href={"/gist/new"}>{" new "}</Link>}</div>
      </div>
    );
  } else {
    return <></>;
  }
};

export { HeaderNavigation };
