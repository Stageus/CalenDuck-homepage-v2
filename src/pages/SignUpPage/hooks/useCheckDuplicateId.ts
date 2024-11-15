import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import axiosInstance from "../../../shared/utils/axios";
import { AxiosError } from "axios";

export type CheckDuplicateIdDto = {
  id: string;
};

export const useCheckDuplicateId = (
  props: UseMutationOptions<void, AxiosError, CheckDuplicateIdDto>
) => {
  return useMutation({
    mutationFn: async (param: CheckDuplicateIdDto) => {
      await axiosInstance.post<void>("/users/check-id", param);
    },
    onError(err) {
      const statusCode = err.response?.status;

      if (statusCode === 400) {
        return alert("유효하지 않은 아이디입니다.");
      }

      if (statusCode === 409) {
        return alert("이미 가입된 아이디입니다.");
      }

      return alert("예상하지 못한 에러가 발생했습니다. 다시 시도해주세요.");
    },
    ...props,
  });
};
