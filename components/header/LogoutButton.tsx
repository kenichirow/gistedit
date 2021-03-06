import Router, { useRouter } from "next/router";
import { useCallback } from "react";

type LogoutBUttonProps = {
  show: boolean;
  logoutCallback: (set: boolean) => void;
};

const LogoutButton = (props: LogoutBUttonProps) => {
  return (
    <button
      onClick={() => {
        props.logoutCallback(false);
      }}
    >
      logout
    </button>
  );
};

export { LogoutButton };
