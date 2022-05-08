import { GistCard } from "./GistCard";
import { useUsersGists } from "../../states/gist";

const GistList = () => {
  const { gists } = useUsersGists();
  if (gists.state === "hasValue" && gists.contents) {
    return (
      <ul>
        {gists.contents.map((gist) => {
          return <GistCard gist={gist} />;
        })}
      </ul>
    );
  }
  return <div>...</div>;
};

export { GistList };
