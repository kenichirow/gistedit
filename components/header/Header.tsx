import { HeaderNavigation } from "./HeaderNavigation";
import { githubUserAtom, useGithubUser } from "../../states/user";
import React, { useCallback, useEffect, useState } from "react";
import { Loadable, RecoilState, useRecoilCallback } from "recoil";
import { LogoutButton } from "../LogoutButton";

import styles from "../../styles/Header.module.css";
import { useRouter } from "next/router";
import { accessTokenQuery } from "../../states/access_token";

const Header: React.FC = () => {
  const router = useRouter();
  const [isLoggedin, setIsLoggedin] = useState(false);
  const [showPulldown, setShwoPulldown] = useState(false);
  const { user } = useGithubUser();

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

  const show = useCallback(() => {
    setShwoPulldown(true);
  }, []);

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
        <div className={styles.avatarWrapper}>
          <div className={styles.avatarImage}>
            <img src={user.contents.avatar_url} alt="" width={23} height={23} />
          </div>
          <div className={styles.avatar}>{user.contents.name}</div>
          <div onClick={show}>{" ↓ "}</div>
          <LogoutButton show={showPulldown} logoutCallback={logout} />
        </div>
      </div>
    );
  } else {
    return <div className={styles.header}></div>;
  }
};

export { Header };
