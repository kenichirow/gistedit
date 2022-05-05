import { LoginWithGithub } from "./LoginWithGithub";
import { useGithubUser } from "../../states/user";

const Login: React.FC<{ isLoggedin: boolean }> = ({ isLoggedin }) => {
  return <div>{!isLoggedin && <LoginWithGithub />}</div>;
};

export { Login };
