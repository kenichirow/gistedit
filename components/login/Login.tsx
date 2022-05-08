import { LoginWithGithub } from "./LoginWithGithub";

const Login: React.FC<{ isLoggedin: boolean }> = ({ isLoggedin }) => {
  return <div>{!isLoggedin && <LoginWithGithub />}</div>;
};

export { Login };
