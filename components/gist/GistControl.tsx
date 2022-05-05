import React from "react";

export type GistControlProps = {
  onUpdate: (e: React.MouseEvent<HTMLElement>) => void;
};

const GistControl: React.FC<GistControlProps> = ({ onUpdate }) => {
  return (
    <div>
      <button onClick={onUpdate}>Update</button>
    </div>
  );
};

export { GistControl };
