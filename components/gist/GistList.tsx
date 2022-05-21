import { GistCard } from "./GistCard";
import { useGists } from "../../states/gist";

const GistList = () => {
  const { gists } = useGists();

  if (gists.state === "hasValue") {
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
