import { useMutation, UseMutationOptions, useQuery, UseQueryOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRemoveLoginCookie } from "../../../shared/hooks/useRemoveCookie";
import axiosInstance from "../../../shared/utils/axios";
import { useGetLoginToken } from "../../../shared/hooks/useGetLoginToken";
import { useNavigate } from "react-router-dom";
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

  const query = useQuery<GetScheduleResponseDto, AxiosError>({
    queryKey: ["GET-SCHEDULES-ALL"],
    async queryFn(): Promise<GetScheduleResponseDto> {
      const { data } = await axiosInstance.get<GetScheduleResponseDto>(
        `/schedules?yearMonth=${monthYear}`,
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
      removeLoginToken();
      navigate("/");
      return;
    }

    return alert("예상하지 못한 에러가 발생했습니다.");
  }, [query.error]);

  return query;
};