import React, { useCallback, useState } from "react";

export type GistControlProps = {
  onUpdate: () => void;
  onNewGistFile: (filename: string) => void;
};

const GistControl: React.FC<GistControlProps> = ({
  onUpdate,
  onNewGistFile,
}) => {
  const [newFileName, setNewFileName] = useState("");
  const fileNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setNewFileName(e.target.value);
    },
    [newFileName]
  );
  return (
    <div>
      <input
        type="text"
        name=""
        id=""
        value={newFileName}
        onChange={fileNameChange}
      />
      <button
        onClick={() => {
          onNewGistFile(newFileName);
        }}
      >
        New
      </button>
      <button
        onClick={() => {
          onUpdate();
        }}
      >
        Update
      </button>
    </div>
  );
};

export { GistControl };
