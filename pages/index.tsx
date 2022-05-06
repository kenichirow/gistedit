import type { NextPage } from "next";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Login } from "../components/login/Login";
import { useGithubUser } from "../states/user";
import { GistList } from "../components/gist/GistList";

const HomePage: NextPage = () => {
  const [isLoggedin, setIsLoggedin] = useState(false);
  const { user } = useGithubUser();

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    console.log(user);
    if (user.state == "hasValue" && user.contents) {
      setIsLoggedin(true);
    }
  }, [user, isLoggedin, setIsLoggedin]);

  return (
    <div>
      <Login isLoggedin={isLoggedin} />
      {isLoggedin && <GistList />}
    </div>
  );
};

export default HomePage;
