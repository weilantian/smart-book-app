import axios, { AxiosInstance, AxiosResponse } from "axios";
import {
  type LoginDto,
  type UserInfo,
  type SignupDto,
  type Event,
  CreateSlotDto,
  Bookable,
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

// const handleResponse = <T = any, R = AxiosResponse<T>>(request: Promise<R>) => {
//   return request
//     .then((response) => {
//       return response.data;
//     })
//     .catch((error) => {
//       if (error.response) {
//         return Promise.reject(error.response.data);
//       } else {
//         return Promise.reject(error);
//       }
//     });
// };

//create a function that updates the token in the header
export const updateToken = (token: string) => {
  Object.assign(axiosInstance.defaults, {
    headers: { Authorization: "Bearer " + token },
  });
};

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

export const createEvent = (eventName: string) =>
  axiosInstance.post<Event>("/event/create", {
    name: eventName,
  });

export const deleteEvent = (eventId: string) =>
  axiosInstance.delete(`/event/${eventId}`);

export const getEvent = (eventId: string) =>
  axiosInstance.get<Event>(`/event/${eventId}`);

export const createBookable = (bookable: Bookable) =>
  axiosInstance.post<Bookable>("/bookable/", bookable);
