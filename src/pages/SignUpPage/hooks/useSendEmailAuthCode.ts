import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";
import axiosInstance from "../../../shared/utils/axios";

export type SendEmailAuthCodeDto = {
  email: string;
  checkDuplicated: boolean;
};

export const useSendEmailAuthCode = (
  options: UseMutationOptions<void, AxiosError, SendEmailAuthCodeDto>
) => {
  return useMutation({
    async mutationFn(param: SendEmailAuthCodeDto) {
      await axiosInstance.post<void>(process.env.REACT_APP_API_KEY + "/auth/email", param);
    },
    onError(err) {
      const statusCode = err.response?.status;

      if (statusCode === 400) {
        return alert("유효하지 않은 이메일 형식입니다.");
      }

      if (statusCode === 409) {
        return alert("이미 가입된 이메일입니다.");
      }

      return alert("예상하지 못한 에러가 발생했습니다. 다시 시도해주세요.");
    },
    ...options,
  });
};
