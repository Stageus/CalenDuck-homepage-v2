import { MutationOptions, useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import axiosInstance from "../../../shared/utils/axios";
import { useNavigate } from "react-router-dom";
import { useRemoveLoginCookie } from "../../../shared/hooks/useRemoveCookie";
import { useGetLoginToken } from "../../../shared/hooks/useGetLoginToken";

type CreatePersonalScheduleDto = {
  fullDate: string;
  personalContents: string;
};

export const useCreatePersonalSchedule = (
  options: MutationOptions<void, AxiosError, CreatePersonalScheduleDto>
) => {
  const getLoginToken = useGetLoginToken();
  const navigate = useNavigate();
  const removeLoginCookie = useRemoveLoginCookie();

  return useMutation({
    async mutationFn(param: CreatePersonalScheduleDto) {
      const { data } = await axiosInstance.post("/schedules", param, {
        headers: {
          Authorization: `Bearer ${getLoginToken()}`,
        },
      });

      return data;
    },
    onError(err) {
      const statusCode = err.response?.status;

      if (statusCode === 400) {
        return alert("");
      }

      if (statusCode === 401) {
        alert("로그인이 만료되었습니다.");
        removeLoginCookie();
        navigate("/");
        return;
      }
    },
    ...options,
  });
};
