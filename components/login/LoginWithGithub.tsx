import { GitHubIcon } from "./GithubIcon";
import styles from "../../styles/LoginWithGithub.module.css";
import { useCallback } from "react";
import { useRouter } from "next/router";

export const LoginWithGithub = () => {
  const router = useRouter();

  const loginOnclick = useCallback(async () => {
    router.replace("/auth/login");
  }, [router]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.githubButton}>
        <GitHubIcon />
        <div onClick={loginOnclick}>
          <span>Sign In With Github</span>
        </div>
      </div>
    </div>
  );
};
