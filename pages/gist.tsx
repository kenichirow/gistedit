import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { GistList } from "../components/gist/GistList";
import { useGithubUser } from "../states/user";

const Gist: NextPage = () => {
  const router = useRouter();
  const { user } = useGithubUser();
  useEffect(() => {
    if (user.state !== "hasValue") {
      router.push("/");
    }
  }, [router, user]);
  return (
    <>
      <GistList />
    </>
  );
};

export default Gist;
