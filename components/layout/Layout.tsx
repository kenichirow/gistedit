import React from "react";
import { useGithubUser } from "../../states/user";
import { Header } from "../header/Header";

const Layout: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const user = useGithubUser();
  return (
    <>
      <Header {...user} />
      <main>{children}</main>
    </>
  );
};

export default Layout;
