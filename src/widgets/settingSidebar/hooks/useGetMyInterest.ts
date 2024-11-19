import { useNavigate } from "react-router-dom";
import { useGetLoginToken } from "../../../shared/hooks/useGetLoginToken";
import { useRemoveLoginCookie } from "../../../shared/hooks/useRemoveCookie";
import { InterestModel } from "../../../shared/model/interest.model";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../../shared/utils/axios";
import { AxiosError } from "axios";
import { useEffect } from "react";

type GetMyInterestAllResponseDto = {
  list: InterestModel[];
};

export const useGetMyInterest = (refetchFlag: number) => {
  const getLoginToken = useGetLoginToken();
  const removeToken = useRemoveLoginCookie();
  const navigate = useNavigate();

  const query = useQuery<GetMyInterestAllResponseDto, AxiosError>({
    queryKey: ["INTEREST-MY-ALL", `MY-INTEREST-ALL-${refetchFlag}`],
    async queryFn() {
      const { data } = await axiosInstance.get<GetMyInterestAllResponseDto>(
        `/interests`,
        {
          headers: {
            Authorization: `Bearer ${getLoginToken()}`,
          },
        }
      );
      return data;
    },
  });

  useEffect(() => {
    if (!query.error) return;

    const statusCode = query.error.response?.status;

    if (statusCode === 401) {
      alert("로그인이 만료되었습니다.");
      removeToken();
      navigate("/");
      return;
    }

    return alert("예상하지 못한 에러가 발생했습니다. 다시 시도해주세요.");
  }, [query.error]);

  return query;
};
