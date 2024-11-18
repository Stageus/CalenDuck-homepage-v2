import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";
import axiosInstance from "../../../shared/utils/axios";
import { SetState } from "../../../types";
import { HelperTextOption } from "../../../shared/components/InputItem";

export type SendEmailAuthCodeDto = {
  email: string;
  checkDuplicated: boolean;
};

export const useSendEmailAuthCode = (
  options: UseMutationOptions<void, AxiosError, SendEmailAuthCodeDto>,
  setHelperText: SetState<HelperTextOption>
) => {
  return useMutation({
    async mutationFn(param: SendEmailAuthCodeDto) {
      await axiosInstance.post<void>("/auth/email", param);
    },
    onError(err) {
      const statusCode = err.response?.status;

      if (statusCode === 400) {
        return setHelperText({
          text: "이메일 형식이 유효하지 않습니다.",
          type: "red",
        });
      }

      if (statusCode === 409) {
        return setHelperText({
          text: "이미 가입된 이메일입니다.",
          type: "red",
        });
      }

      return alert("예상하지 못한 에러가 발생했습니다. 다시 시도해주세요.");
    },
    ...options,
  });
};
