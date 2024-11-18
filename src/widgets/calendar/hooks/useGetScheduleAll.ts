import {
  useMutation,
  UseMutationOptions,
  useQuery,
  UseQueryOptions,
} from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRemoveLoginCookie } from "../../../shared/hooks/useRemoveCookie";
import axiosInstance from "../../../shared/utils/axios";
import { useGetLoginToken } from "../../../shared/hooks/useGetLoginToken";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

type GetScheduleResponseDto = {
  list: {
    idx: number;
    type: string;
    name: string;
    count: number;
  }[][];
};

export const useGetScheduleAll = (monthYear: string) => {
  const navigate = useNavigate();
  const removeLoginToken = useRemoveLoginCookie();
  const getLoginToken = useGetLoginToken();
  const location = useLocation();
  const searchParam = new URLSearchParams(location.search);
  const interestIdx = searchParam.get("interestIdx");

  const query = useQuery<GetScheduleResponseDto, AxiosError>({
    queryKey: ["GET-SCHEDULES-ALL", monthYear, interestIdx],
    async queryFn(): Promise<GetScheduleResponseDto> {
      const { data } = await axiosInstance.get<GetScheduleResponseDto>(
        `/schedules?yearMonth=${monthYear}` +
          (interestIdx ? `&interestIdx=${interestIdx}` : ""),
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
      removeLoginToken();
      navigate("/");
      return;
    }

    return alert("예상하지 못한 에러가 발생했습니다.");
  }, [query.error]);

  return query;
};
