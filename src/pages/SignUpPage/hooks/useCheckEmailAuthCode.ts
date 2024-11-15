import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";
import axiosInstance from "../../../shared/utils/axios";

type CheckEmailAuthCodeDto = {
  email: string;
  code: string;
  pageType: string;
};

type CheckEmailAuthCodeResponseDto = {};

export const useCheckEmailAuthCode = (
  options: UseMutationOptions<CheckEmailAuthCodeResponseDto, AxiosError, CheckEmailAuthCodeDto>
) =>
  useMutation({
    async mutationFn(param: CheckEmailAuthCodeDto) {
      return await axiosInstance.post<CheckEmailAuthCodeResponseDto>(
        process.env.REACT_APP_API_KEY + "/auth/check-code",
        param
      );
    },
    onError(err) {
      const status = err.response?.status;

      if (status === 401 || status === 400) {
        return alert("인증번호가 올바르지 않습니다.");
      }

      return alert("예상하지 못한 에러가 발생했습니다. 다시 시도해주세요.");
    },
    ...options,
  });
