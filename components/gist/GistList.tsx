import { GistCard } from "./GistCard";
import { useGists3 } from "../../states/gist2";

const GistList = () => {
  const { gists } = useGists3();

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
