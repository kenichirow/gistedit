import { GistCard } from "./GistCard";
import { useUsersGists } from "../../states/gist";
import { DefaultValue } from "recoil";

const GistList = () => {
  const { gists } = useUsersGists();
  console.log(gists.state);
  if (gists.state === "hasValue" && gists.contents) {
    console.log("here...");
    console.log(gists.contents);
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
