import { Gist, GistFile } from "../../states/gist";
import Link from "next/link";
import styles from "../../styles/GistCard.module.css";

type RepoProps = { gist: Gist };

const GistCard: React.FC<RepoProps> = ({ gist }) => {
  const files = gist.files;
  //Object.entries(files).map(
  //  (value: [string, GistFile], index: number, array: [string, GistFile][]) => {
  //    console.log(value);
  //  }
  //);
  return (
    <li className={styles.gistCard}>
      <Link href={`gist/${gist.id}`}>
        <div>
          <h3>{gist.id}</h3>
          <a href={gist.html_url}>{gist.html_url}</a>
        </div>
      </Link>
    </li>
  );
};

export { GistCard };
