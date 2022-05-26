import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { Login } from "../components/login/Login";
import { useGithubUser } from "../states/user";
import { GistList } from "../components/gist/GistList";
import { useGists } from "../states/gist";

const HomePage: NextPage = () => {
  const [isLoggedin, setIsLoggedin] = useState(false);
  const { user, login } = useGithubUser();
  const { gists, fetchGists } = useGists();

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
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
