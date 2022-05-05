import type { NextPage } from "next";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Login } from "../components/login/Login";
import { useAccessTokenState } from "../states/access_token";
import { useGithubUser } from "../states/user";

const HomePage: NextPage = () => {
  const [isLoggedin, setIsLoggedin] = useState(false);
  const { user, login } = useGithubUser();
  const { accessToken } = useAccessTokenState();

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    if (user.state == "hasValue" && user.contents) {
      setIsLoggedin(true);
    } else {
      if (accessToken.state === "hasValue" && accessToken.contents != "") {
        login();
      }
    }
  }, [user, login, setIsLoggedin]);

  return (
    <div>
      <Login isLoggedin={isLoggedin} />
      <div>{isLoggedin && <Link href={"/gist"}> gist</Link>}</div>
    </div>
  );
};

export default HomePage;
