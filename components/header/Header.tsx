import { HeaderNavigation } from "./HeaderNavigation";
import { githubUserState, useGithubUser } from "../../states/user";
import React, { useCallback, useEffect, useState } from "react";
import { Loadable, RecoilState, useRecoilCallback } from "recoil";
import { LogoutButton } from "../LogoutButton";

import styles from "../../styles/Header.module.css";
import { useRouter } from "next/router";
import { accessTokenQuery } from "../../states/access_token";

const Header: React.FC = () => {
  const router = useRouter();
  const [showPulldown, setShwoPulldown] = useState(false);
  const { user } = useGithubUser();

  const logout = useRecoilCallback(
    ({ snapshot, set, reset }) =>
      async () => {
        await reset(githubUserState);
        await reset(accessTokenQuery);
        await router.replace("/");
      },
    [router]
  );

  const show = useCallback(() => {
    setShwoPulldown(true);
  }, []);

  if (user.state === "hasValue") {
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
