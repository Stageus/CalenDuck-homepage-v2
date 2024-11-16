import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";
import axiosInstance from "../../../shared/utils/axios";

type LoginDto = {
  id: string;
  pw: string;
};

type LoginResponseDto = {
  token: string;
};

export const useLogin = (options: UseMutationOptions<LoginResponseDto, AxiosError, LoginDto>) =>
  useMutation({
    async mutationFn(loginDto: LoginDto) {
      const { data } = await axiosInstance.post<LoginResponseDto>("/users/login", loginDto);

      return data;
    },
    onError(err) {
      const statusCode = err.response?.status;

      if (statusCode === 400) {
        return alert("아아디 또는 비밀번호가 잘못되었습니다.");
      }

      if (statusCode === 401) {
        return alert("아이디 또는 비밀번호가 잘못되었습니다.");
      }

      return alert("예상하지 못한 에러가 발생했습니다. 다시 시도해주세요.");
    },
    ...options,
  });
