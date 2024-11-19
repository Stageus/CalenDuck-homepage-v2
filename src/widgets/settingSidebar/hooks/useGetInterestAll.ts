import { useQuery } from "@tanstack/react-query";
import { InterestModel } from "../../../shared/model/interest.model";
import { AxiosError } from "axios";
import axiosInstance from "../../../shared/utils/axios";
import { useGetLoginToken } from "../../../shared/hooks/useGetLoginToken";
import { useRemoveLoginCookie } from "../../../shared/hooks/useRemoveCookie";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

type GetInterestAllResponseDto = {
  list: InterestModel[];
};

export const useGetInterestAll = () => {
  const getLoginToken = useGetLoginToken();
  const removeToken = useRemoveLoginCookie();
  const navigate = useNavigate();

  const query = useQuery<GetInterestAllResponseDto, AxiosError>({
    queryKey: ["INTEREST-ALL"],
    async queryFn() {
      const { data } = await axiosInstance.get<GetInterestAllResponseDto>(
        `/interests/all`,
        {
          headers: {
            Authorization: `Bearer ${getLoginToken()}`,
          },
        }
      );

      return data;
    },
    staleTime: 0,
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

    return alert("예상하지 못한 에러가 발생했습니다.");
  }, [query.error]);

  return query;
};
