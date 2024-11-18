import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { useGetLoginToken } from "../../../shared/hooks/useGetLoginToken";
import { useRemoveLoginCookie } from "../../../shared/hooks/useRemoveCookie";
import { AxiosError } from "axios";
import axiosInstance from "../../../shared/utils/axios";
import { useNavigate } from "react-router-dom";

type AlarmOnDto = {
  idx: number;
};

export const useAlarmOn = (options: UseMutationOptions<void, AxiosError, AlarmOnDto>) => {
  const getLoginToken = useGetLoginToken();
  const removeToken = useRemoveLoginCookie();
  const navigate = useNavigate();

  const mutate = useMutation({
    async mutationFn(dto: AlarmOnDto) {
      const { data } = await axiosInstance.post(
        `/schedules/${dto.idx}/notify`,
        {},
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

      alert("예상하지 못한 에러가 발생했습니다. 다시 시도해주세요.");
    },
    ...options,
  });

  return mutate;
};
