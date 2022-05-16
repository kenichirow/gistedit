import styles from "../../styles/GistCard.module.css";
import { useCallback } from "react";
import { useRouter } from "next/router";
import { Gist, useGists3 } from "../../states/gist2";

type RepoProps = { gist: Gist };

const GistCard: React.FC<RepoProps> = ({ gist }) => {
  const router = useRouter();
  //  const { setGist } = useUsersGists();
  const { setGist } = useGists3();

  const onClick = useCallback(() => {
    setGist(gist.id);
    router.replace(`/gist/${gist.id}`);
  }, [gist]);

  const filename = Object.keys(gist.files)[0];
  return (
    <li className={styles.gistCard} onClick={onClick}>
      <div>
        <h3>{filename}</h3>
      </div>
    </li>
  );
};

export { GistCard };
