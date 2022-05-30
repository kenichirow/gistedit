import React, { useCallback } from "react";
import { GistFile } from "../../states/gist";
import styles from "../../styles/GistDetail.module.css";

const GistFileContent: React.FC<{
  file: GistFile;
  onChange: (filename: string, content: string) => void;
}> = ({ file, onChange }) => {
  const onTextAreaOnChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChange(file.filename, e.target.value);
    },
    [file]
  );
  return (
    <div key={file.filename}>
      <h2>{file.filename}</h2>
      <button>delete</button>
      <p>
        {file.size}
        {"b"}
      </p>
      <p>{file.language}</p>
      <textarea
        className={styles.gistCode}
        onChange={onTextAreaOnChange}
        value={file.raw}
      />
    </div>
  );
};

export { GistFileContent };
