import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";
import axiosInstance from "../../../shared/utils/axios";

type SignUpDto = {
  id: string;
  pw: string;
  nickname: string;
  email: string;
  emailToken: string;
};

export const useSignUp = (options: UseMutationOptions<void, AxiosError, SignUpDto>) => {
  return useMutation({
    mutationFn: async (signUpDto: SignUpDto) => {
      const { data } = await axiosInstance.post<void>(
        "/users",
        {
          id: signUpDto.id,
          pw: signUpDto.pw,
          nickname: signUpDto.nickname,
          email: signUpDto.email,
        },
        {
          headers: {
            Authorization: `Bearer ${signUpDto.emailToken}`,
          },
        }
      );

      return data;
    },
    onError(err) {
      const statusCode = err.response?.status;

      if (statusCode === 401) {
        return alert("이메일 인증 시간이 만료되었습니다. 이메일 인증을 다시 시도해주세요.");
      }

      if (statusCode === 409) {
        return alert("아이디 또는 이메일이 중복 되었습니다. 중복 확인을 다시 진행해주세요.");
      }

      return alert("예상하지 못한 에러가 발생했습니다. 다시 시도해주세요.");
    },
    ...options,
  });
};
