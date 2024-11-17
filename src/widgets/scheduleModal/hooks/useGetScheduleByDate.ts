import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../../shared/utils/axios";
import { useEffect } from "react";
import { AxiosError } from "axios";
import { useRemoveLoginCookie } from "../../../shared/hooks/useRemoveCookie";
import { useNavigate } from "react-router-dom";
import { useGetLoginToken } from "../../../shared/hooks/useGetLoginToken";

/**
 * 해당 API에서 사용하는 스케쥴 모델.
 * 백엔드에서 모델 정의가 안되어있어서 각 API 별로 해당 타입을 정의할 수 밖에 없음.
 */
export type ScheduleDetailModel = {
  idx: number;
  name: string;
  time: string;
  type: string;
  contents: string;
  priority: boolean;
};

type ScheduleDetailResponseDto = {
  list: ScheduleDetailModel[];
};

/**
 * @param date 날짜 ex. YYYYMMDD
 */
export const useGetScheduleByDate = (date: string) => {
  const removeLoginToken = useRemoveLoginCookie();
  const navigate = useNavigate();
  const getLoginToken = useGetLoginToken();

  const query = useQuery<unknown, AxiosError, ScheduleDetailResponseDto>({
    queryKey: ["SCHEDULES-ALL", date],
    async queryFn(): Promise<ScheduleDetailResponseDto> {
      const { data } = await axiosInstance.get<ScheduleDetailResponseDto>(
        `/schedules/details?fullDate=${date}`,
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

    alert("예상하지 못한 에러가 발생헀습니다. 다시 시도해주세요.");
  }, [query.error]);

  return query;
};
