import { HeaderNavigation } from "./HeaderNavigation";
import { githubUserAtom, useGithubUser } from "../../states/user";
import React, { useCallback, useEffect, useState } from "react";
import { Loadable, RecoilState, useRecoilCallback } from "recoil";
import { GitHubUser } from "../../states/user";
import { LogoutButton } from "../LogoutButton";

import styles from "../../styles/Header.module.css";
import { useRouter } from "next/router";
import { useUsersGists } from "../../states/gist";
import { accessTokenQuery } from "../../states/access_token";

type headerProps = {
  user: Loadable<GitHubUser>;
  resetUser: () => void;
};

const Header: React.FC<headerProps> = ({ user, resetUser }) => {
  const router = useRouter();
  const [isLoggedin, setIsLoggedin] = useState(false);
  const { user: userState } = useGithubUser();

  const logout = useRecoilCallback(
    ({ snapshot, set, reset }) =>
      async () => {
        await reset(githubUserAtom);
        await reset(accessTokenQuery);
        setIsLoggedin(false);
        await router.replace("/");
      },
    [router, setIsLoggedin]
  );

  useEffect(() => {
    if (typeof window == "undefined") {
      return;
    }

    if (user.state == "hasValue" && user.contents !== undefined) {
      setIsLoggedin(true);
    }
  }, [user, setIsLoggedin]);

  if (user.state === "hasValue" && user.contents) {
    return (
      <div className={styles.header}>
        <HeaderNavigation />
        <LogoutButton logoutCallback={logout} />
      </div>
    );
  } else {
    <div className={styles.header}></div>;
  }
};

export { Header };
