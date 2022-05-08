import { useEffect, useState } from "react";
import { Gist, GistFile, useUsersGists } from "../../states/gist";
import Link from "next/link";

import styles from "../../styles/Sidebar.module.css";

const SideBarItem: React.FC<{ gistItem: Gist }> = ({ gistItem }) => {
  const { gist } = useUsersGists();
  const [selected, setSelect] = useState(false);

  useEffect(() => {
    if (gist.state == "hasValue") {
      setSelect(gist.contents.id == gistItem.id);
    }
  }, [gist]);

  const filename = Object.keys(gistItem.files)[0];

  return (
    <Link href={`/gist/${gistItem.id}`}>
      <li className={selected ? styles.gist_slected : ""}>
        <span>{filename}</span>
      </li>
    </Link>
  );
};

const SideBar = () => {
  const { gists } = useUsersGists();
  if (gists.state == "hasValue" && gists.contents) {
    return (
      <div className={styles.sidebar}>
        <ul>
          {gists.contents.map((gist: Gist) => {
            return <SideBarItem gistItem={gist}></SideBarItem>;
          })}
        </ul>
      </div>
    );
  }
  return (
    <div className={styles.sidebar}>
      <ul>
        <li>
          <span></span>
        </li>
      </ul>
    </div>
  );
};
export { SideBar };
