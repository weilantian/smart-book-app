import axios from "axios";
import {
  type LoginDto,
  type UserInfo,
  type SignupDto,
  type Event,
  CreateSlotDto,
  Slot,
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

export const createSlot = (dto: CreateSlotDto) =>
  axiosInstance.post<Slot>("/slot/create", dto);

export const getSlotsOfEvent = (eventId: string) =>
  axiosInstance.get<Array<Slot>>(`/slot/by-event?eventId=${eventId}`);

export const getEvent = (eventId: string) =>
  axiosInstance.get<Event>(`/event/${eventId}`);
