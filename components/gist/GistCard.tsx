import styles from "../../styles/GistCard.module.css";
import { useRouter } from "next/router";
import { Gist } from "../../states/gist";
import Link from "next/link";

type RepoProps = { gist: Gist };

const GistCard: React.FC<RepoProps> = ({ gist }) => {
  const router = useRouter();
  const filename = Object.keys(gist.files)[0];
  return (
    <Link href={`/gist/${gist.id}`}>
      <li className={styles.gistCard}>
        <div>
          <h3>{filename}</h3>
        </div>
      </li>
    </Link>
  );
};

export { GistCard };
