import { HeaderNavigation } from "./HeaderNavigation";
import { useGithubUser } from "../../states/user";
import React, { useCallback, useState } from "react";
import { LogoutButton } from "./LogoutButton";

import styles from "../../styles/Header.module.css";
import { useRouter } from "next/router";

const Header: React.FC = () => {
  const router = useRouter();
  const [showPulldown, setShwoPulldown] = useState(false);
  const { user, logout } = useGithubUser();

  const onLogoutClick = useCallback(() => {
    logout(async () => {
      await router.replace("/");
    });
  }, [logout]);

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
          <LogoutButton show={showPulldown} logoutCallback={onLogoutClick} />
        </div>
      </div>
    );
  } else {
    return <div className={styles.header}></div>;
  }
};

export { Header };
