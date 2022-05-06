import {
  atom,
  selector,
  useRecoilValue,
  RecoilState,
  useRecoilCallback,
  DefaultValue,
  useRecoilValueLoadable,
} from "recoil";

export const accessTokenState = atom<string>({
  key: "myapp.kenichirow.com:access_token:atom",
  default: "",
});

const accessTokenQuery: RecoilState<string> = selector({
  key: "myapp.kenichirow.com:access_token:selector",
  get: async ({ get }) => {
    console.log("token query found");
    const token = get(accessTokenState);
    console.log("...");
    if (token != "") {
      console.log("token query found");
      return token;
    }
    if (typeof window !== "undefined") {
      console.log("....");
      const token = localStorage.getItem("accessToken");
      if (token) {
        console.log("token found");
        console.log("token");
        return token;
      }
      console.log("token not found");
      return "";
    }
    console.log("token not found..");
    return "";
  },
  set: ({ set }, newToken) => {
    set(accessTokenState, newToken);
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
  const accessToken = useRecoilValueLoadable(accessTokenQuery);

  const setAccessToken = useRecoilCallback(
    ({ set }) =>
      (newAccessToken: string) => {
        set(accessTokenQuery, newAccessToken);
      },
    [accessTokenQuery]
  );
  return { accessToken, setAccessToken };
};

export { useAccessTokenState, accessTokenQuery };
