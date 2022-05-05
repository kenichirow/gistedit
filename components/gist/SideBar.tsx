import { useEffect, useState } from "react";
import { Gist, GistFile, useUsersGists } from "../../states/gist";
import Link from "next/link";

import styles from "../../styles/Sidebar.module.css";

const SideBarItem: React.FC<{ gist: Gist }> = ({ gist }) => {
  return (
    <li>
      <Link href={`/gist/${gist.id}`}>
        <span>{gist.id}</span>
      </Link>
    </li>
  );
};

const SideBar = () => {
  const usesGistsLoadable = useUsersGists();
  const [gists, setGists] = useState<Gist[]>([]);

  useEffect(() => {
    if (usesGistsLoadable.state == "hasValue") {
      setGists(usesGistsLoadable.contents as Gist[]);
    }
  }, [usesGistsLoadable, setGists]);

  return (
    <div className={styles.sidebar}>
      <ul>
        {gists.map((gist) => {
          return <SideBarItem gist={gist}></SideBarItem>;
        })}
      </ul>
    </div>
  );
};
export { SideBar };
