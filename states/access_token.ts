import {
  selector,
  useRecoilValue,
  RecoilState,
  useRecoilCallback,
  DefaultValue,
} from "recoil";

const accessTokenState: RecoilState<string | undefined> = selector({
  key: "myapp.kenichirow.com:user:access_token",
  get: async () => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("accessToken");
      if (token) {
        return token;
      }
    }
    return;
  },
  set: (_, newToken) => {
    if (typeof window !== "undefined") {
      if (newToken instanceof DefaultValue) {
        localStorage.removeItem("accessToken");
        return;
      }
      localStorage.setItem("accessToken", newToken as string);
    }
  },
});

const useAccessTokenState = () => {
  const accessToken = useRecoilValue(accessTokenState);

  const setAccessToken = useRecoilCallback(
    ({ set }) =>
      (newAccessToken: string) => {
        set(accessTokenState, newAccessToken);
      },
    [accessTokenState]
  );
  return { accessToken, setAccessToken };
};

export { useAccessTokenState, accessTokenState };
