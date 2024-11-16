import { useCookies } from "react-cookie";

export const useGetLoginToken = () => {
  const [cookies] = useCookies(["token"]);

  return () => {
    return cookies.token;
  };
};
