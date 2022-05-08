import React, { useEffect } from "react";
import { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";

import { useAccessTokenState } from "../../states/access_token";
import { fetchGithubUser, GitHubUser, useGithubUser } from "../../states/user";

type CallbackProps = {
  newAccessToken: string;
  user: GitHubUser;
};

const Callback: React.FC<CallbackProps> = ({ newAccessToken, user }) => {
  const router = useRouter();
  const { accessToken, setAccessToken } = useAccessTokenState();
  const { user: userState, setUser } = useGithubUser();

  useEffect(() => {
    setAccessToken(newAccessToken);
    setUser(user);
    console.log(userState);
    if (typeof window == "undefined") {
      return;
    }
    if (userState.state == "hasValue" && userState.contents) {
      console.log(userState.contents);
      router.replace("/");
    }
  }, [router, userState, accessToken, newAccessToken]);

  return <></>;
};

const CallbackPage: NextPage<CallbackProps> = ({ newAccessToken, user }) => {
  return <Callback newAccessToken={newAccessToken} user={user} />;
};

export const getServerSideProps: GetServerSideProps = async ({
  query,
  req,
}) => {
  const code = query.code;
  const clientId = process.env.GITHUB_OAUTH_CLIENT_ID;
  const clientSecret = process.env.GITHUB_OAUTH_CLIENT_SECRET;
  const redirectUri = process.env.CALLBACK_URL;

  const body = {
    code: code as string,
    client_id: clientId as string,
    client_secret: clientSecret as string,
    redirect_uri: redirectUri as string,
  };

  const queryParams = new URLSearchParams(body);
  const url = `https://github.com/login/oauth/access_token?` + queryParams;

  const res = await fetch(url, {
    method: "POST",
    credentials: "include",
    headers: {
      Accept: "application/json",
    },
  });

  const json = await res.json();
  console.log(json);

  const user = await fetchGithubUser(json.access_token);

  console.log("--------");
  console.log(json.access_token);
  console.log(json.scope);
  console.log(json.token_type);
  console.log("--------");

  return { props: { newAccessToken: json.access_token, user: user } };
};

export default CallbackPage;
