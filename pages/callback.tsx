import { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useAccessTokenState } from "../states/access_token";
import { useGithubUser } from "../states/user";

type CallbackProps = {
  newAccessToken: string;
};

const Callback: React.FC<CallbackProps> = ({ newAccessToken }) => {
  const router = useRouter();
  const { accessToken, setAccessToken } = useAccessTokenState();
  const { login } = useGithubUser();
  useEffect(() => {
    (async () => {
      if (!accessToken) {
        setAccessToken(newAccessToken);
      }
      await login().then(() => {
        router.push("/");
      });
    })();
  }, [router, accessToken, newAccessToken, setAccessToken]);

  return <></>;
};

const CallbackPage: NextPage<CallbackProps> = ({ newAccessToken }) => {
  return <Callback newAccessToken={newAccessToken} />;
};

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const code = query.code;
  const clientId = process.env.GITHUB_OAUTH_CLIENT_ID;
  const clientSecret = process.env.GITHUB_OAUTH_CLIENT_SECRET;
  const redirect_uri = process.env.CALLBACK_URL;

  const body = {
    code: code as string,
    client_id: clientId as string,
    client_secret: clientSecret as string,
    redirect_uri: redirect_uri as string,
  };

  const query_params = new URLSearchParams(body);
  const url = `https://github.com/login/oauth/access_token?` + query_params;

  const res = await fetch(url, {
    method: "POST",
    credentials: "include",
    headers: {
      Accept: "application/json",
    },
  });

  const json = await res.json();

  console.log("--------");
  console.log(json.access_token);
  console.log(json.scope);
  console.log(json.token_type);
  console.log("--------");

  return { props: { newAccessToken: json.access_token } };
};

export default CallbackPage;
