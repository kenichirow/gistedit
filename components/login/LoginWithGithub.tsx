import { GitHubIcon } from "./GithubIcon";
import styles from "../../styles/LoginWithGithub.module.css";
import Link from "next/link";
import { useGithubUser } from "../../states/user";
import { useCallback } from "react";
import { useRouter } from "next/router";
import { useAccessTokenState } from "../../states/access_token";
export const LoginWithGithub = () => {
  const { login } = useGithubUser();
  const { accessToken } = useAccessTokenState();
  const router = useRouter();
  const loginOnclick = useCallback(async () => {
    if (accessToken) {
      await login().then(() => {
        router.push("/");
      });
    } else {
      router.push("/login");
    }
  }, [login, router]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.githubButton}>
        <GitHubIcon />
        <button onClick={loginOnclick}>
          <span>Sign In With Github</span>
        </button>
      </div>
    </div>
  );
};
