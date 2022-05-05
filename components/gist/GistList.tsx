import { useEffect, useState } from "react";
import { GistCard } from "./GistCard";
import { useUsersGists, Gist } from "../../states/gist";

const GistList = () => {
  const gists = useUsersGists();
  if (gists.state != "hasValue") {
    return <div>loading...</div>;
  }
  const contents: Gist[] = gists.contents as Gist[];
  return (
    <ul>
      {contents.map((gist) => {
        return <GistCard gist={gist} />;
      })}
    </ul>
  );
};

export { GistList };
