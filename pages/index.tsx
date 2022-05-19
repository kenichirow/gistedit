import type { NextPage } from "next";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Login } from "../components/login/Login";
import { useGithubUser } from "../states/user";
import { GistList } from "../components/gist/GistList";
import { useUsersGists } from "../states/gist";
import { useRecoilValue } from "recoil";

import { useGists3 } from "../states/gist2";

const HomePage: NextPage = () => {
  const [isLoggedin, setIsLoggedin] = useState(false);
  const { user, login } = useGithubUser();
  const { resetGist } = useUsersGists();
  const { gists, fetchGists } = useGists3();

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    resetGist();
    (async () => {
      if (user.state == "hasValue" && user.contents) {
        setIsLoggedin(true);
        if (gists.state === "hasValue") {
          return;
        }
        fetchGists();
      } else {
        setIsLoggedin(false);
        await login();
      }
    })();
  }, [user, isLoggedin, login, fetchGists, setIsLoggedin]);

  return (
    <div>
      <Login isLoggedin={isLoggedin} />
      {isLoggedin && <GistList />}
    </div>
  );
};

export default HomePage;
