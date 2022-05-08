import { GetServerSideProps } from "next";

const Login = () => {
  return <div></div>;
};

export const getServerSideProps: GetServerSideProps = async () => {
  const clientId = process.env.GITHUB_OAUTH_CLIENT_ID;
  const body = {
    client_id: clientId as string,
    scope: "user,gist",
  };

  const queryParams = new URLSearchParams(body);
  return {
    redirect: {
      statusCode: 302,
      destination: `https://github.com/login/oauth/authorize?${queryParams}`,
    },
  };
};

export default Login;
