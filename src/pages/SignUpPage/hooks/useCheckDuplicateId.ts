import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import axiosInstance from "../../../shared/utils/axios";
import { AxiosError } from "axios";
import { SetState } from "../../../types";
import { HelperTextOption } from "../../../shared/components/InputItem";

export type CheckDuplicateIdDto = {
  id: string;
};

export const useCheckDuplicateId = (
  props: UseMutationOptions<void, AxiosError, CheckDuplicateIdDto>,
  setHelperText: SetState<HelperTextOption>
) => {
  return useMutation({
    mutationFn: async (param: CheckDuplicateIdDto) => {
      await axiosInstance.post<void>("/users/check-id", param);
    },
    onError(err) {
      const statusCode = err.response?.status;

      if (statusCode === 400) {
        setHelperText({
          text: "아이디는 알파벳 및 숫자로 이루어진 6~12글자이어야합니다.",
          type: "red",
        });
        return;
      }

      if (statusCode === 409) {
        setHelperText({
          text: "이미 가입된 아이디입니다.",
          type: "red",
        });
        return;
      }

      return alert("예상하지 못한 에러가 발생했습니다. 다시 시도해주세요.");
    },
    ...props,
  });
};
