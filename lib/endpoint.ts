import axios from "axios";
import {
  type LoginDto,
  type UserInfo,
  type SignupDto,
  type Event,
} from "./models";

export const isAuthorized = () =>
  localStorage.getItem("smart_book_token") ? true : false;

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_ENDPOINT_URL,
  headers: {
    "Content-Type": "application/json",
    Authorization:
      typeof window !== "undefined"
        ? "Bearer " + localStorage.getItem("smart_book_token")
        : undefined,
  },
});

export const signup = async (dto: SignupDto) =>
  await axiosInstance.post("/auth/signup", dto);

export const login = async (dto: LoginDto) =>
  await axiosInstance.post("/auth/login", dto);

export const getCurrentUser = async () =>
  await axiosInstance.get<UserInfo>("/user/me");

export const getUserManagedEvents = async (showEnded: boolean) =>
  await axiosInstance.get<Array<Event>>("/event/user-managed-events", {
    params: {
      showEnded,
    },
  });
