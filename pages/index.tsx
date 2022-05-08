import type { NextPage } from "next";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Login } from "../components/login/Login";
import { useGithubUser } from "../states/user";
import { GistList } from "../components/gist/GistList";
import { useUsersGists } from "../states/gist";
import { useRecoilValue } from "recoil";

const HomePage: NextPage = () => {
  const [isLoggedin, setIsLoggedin] = useState(false);
  const { user, login } = useGithubUser();
  const { resetGist } = useUsersGists();

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    resetGist();
    (async () => {
      if (user.state == "hasValue" && user.contents) {
        setIsLoggedin(true);
      } else {
        setIsLoggedin(false);
        await login();
      }
    })();
  }, [user, isLoggedin, login, setIsLoggedin]);

  return (
    <div>
      <Login isLoggedin={isLoggedin} />
      {isLoggedin && <GistList />}
    </div>
  );
};

export default HomePage;
