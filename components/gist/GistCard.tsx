import { Gist, GistFile, useUsersGists } from "../../states/gist";
import Link from "next/link";
import styles from "../../styles/GistCard.module.css";
import { useCallback } from "react";
import { useRouter } from "next/router";

type RepoProps = { gist: Gist };

const GistCard: React.FC<RepoProps> = ({ gist }) => {
  const files = gist.files;
  const router = useRouter();
  const { setGist } = useUsersGists();
  const onClick = useCallback(() => {
    console.log("Set???");
    setGist(gist.id);
    router.replace(`/gist/${gist.id}`);
  }, [gist]);
  //Object.entries(files).map(
  //  (value: [string, GistFile], index: number, array: [string, GistFile][]) => {
  //    console.log(value);
  //  }
  //);
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
