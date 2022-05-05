import { HeaderNavigation } from "./HeaderNavigation";
import { useGithubUser } from "../../states/user";
import React, { useCallback, useEffect, useState } from "react";
import { Loadable, RecoilState } from "recoil";
import { GitHubUser } from "../../states/user";
import { LogoutButton } from "../LogoutButton";

import styles from "../../styles/Header.module.css";
import { useRouter } from "next/router";

type headerProps = {
  user: Loadable<GitHubUser>;
  resetUser: () => void;
};

const Header: React.FC<headerProps> = ({ user, resetUser }) => {
  const router = useRouter();
  const [isLoggedin, setIsLoggedin] = useState(false);
  const logout = useCallback(() => {
    resetUser();
    router.push("/");
  }, [router, resetUser]);

  useEffect(() => {
    if (user.state == "hasValue" && user.contents) {
      console.log(user.contents);
      setIsLoggedin(true);
    }
  }, [user, setIsLoggedin]);

  return (
    <div className={styles.header}>
      <HeaderNavigation user={user.contents} isLoggedin={isLoggedin} />
      {isLoggedin && <LogoutButton logoutCallback={logout} />}
    </div>
  );
};

export { Header };
