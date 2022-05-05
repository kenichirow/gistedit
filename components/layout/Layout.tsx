import { useEffect } from "react";
import { useGithubUser } from "../../states/user";
import { Header } from "../header/Header";
export default function Layout({ children }) {
  const user = useGithubUser();
  useEffect(() => {}, [user]);
  return (
    <>
      <Header {...user} />
      <main>{children}</main>
    </>
  );
}
