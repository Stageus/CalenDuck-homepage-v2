import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";
import axiosInstance from "../../../shared/utils/axios";
import { useGetLoginToken } from "../../../shared/hooks/useGetLoginToken";
import { useRemoveLoginCookie } from "../../../shared/hooks/useRemoveCookie";
import { useNavigate } from "react-router-dom";

type UpdateScheduleByIdxDto = {
  idx: number;
  fullDate: string;
  personalContents: string;
};

export const useUpdateScheduleByIdx = (
  options: UseMutationOptions<void, AxiosError, UpdateScheduleByIdxDto>
) => {
  const getLoginToken = useGetLoginToken();
  const removeToken = useRemoveLoginCookie();
  const navigate = useNavigate();

  return useMutation({
    async mutationFn(dto) {
      const { data } = await axiosInstance.put(
        `/schedules/${dto.idx}`,
        {
          fullDate: dto.fullDate,
          personalContents: dto.personalContents,
        },
        {
          headers: {
            Authorization: `Bearer ${getLoginToken()}`,
          },
        }
      );

      return data;
    },
    onError(err) {
      const statusCode = err.response?.status;

      if (statusCode === 401) {
        alert("로그인이 만료되었습니다.");
        removeToken();
        navigate("/");
        return;
      }

      return alert("예상하지 못한 에러가 발생했습니다. 다시 시도해주세요.");
    },
    ...options,
  });
};