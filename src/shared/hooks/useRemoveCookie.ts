import { useCookies } from "react-cookie";

export const useRemoveLoginCookie = () => {
  const [, , removeCookie] = useCookies(["token"]);

  return () => {
    removeCookie("token", {
      path: "/",
    });
  };
};
