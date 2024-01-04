import axios, { AxiosInstance, AxiosResponse } from "axios";
import {
  type LoginDto,
  type UserInfo,
  type SignupDto,
  type Event,
  CreateSlotDto,
  Bookable,
  ScheduleBookingInput,
  BookedSlot,
} from "./models";
import { z } from "zod";

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

// On there is a 400 error, remove the local storage token
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 401) {
      localStorage.removeItem("smart_book_token");
    }
    return Promise.reject(error);
  }
);

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

export const getCurrentUser = () => axiosInstance.get<UserInfo>("/user/me");

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

export const updateBookable = (bookable: Bookable) =>
  axiosInstance.post<Bookable>(`/bookable/${bookable.id}`, bookable);

export const deleteBookable = (bookableId: string) =>
  axiosInstance.delete(`/bookable/${bookableId}`);

export const getBookable = (id: string) =>
  axiosInstance.get<Bookable>(`/bookable/${id}`);

//TODO: Add type definition for the response
export const scheduleBooking = async (
  bookableId: string,
  scheduleBookingInput: ScheduleBookingInput
) => {
  const response = await axiosInstance.post(
    `/bookable/${bookableId}/book`,
    scheduleBookingInput
  );
  const schema = z.object({
    attendeeBookingReferenceCode: z.string(),
    duration: z.number(),
    endTime: z.string().transform((val) => new Date(val)),
    startTime: z.string().transform((val) => new Date(val)),
    bookable: z.object({
      location: z.string(),
      name: z.string(),
    }),
  });
  return schema.parse(response.data);
};

export const getCurrentUserBookings = async ({
  startDate,
  endDate,
}: {
  startDate?: Date;
  endDate?: Date;
}): Promise<Array<BookedSlot>> => {
  const response = await axiosInstance.get<Array<BookedSlot>>("/booking", {
    params: {
      startDate: startDate?.toISOString(),
      endDate: endDate?.toISOString(),
    },
  });
  const schema = z.array(
    z.object({
      id: z.string(),
      duration: z.number(),
      startTime: z.string().transform((val) => new Date(val)),
      endTime: z.string().transform((val) => new Date(val)),
      bookableId: z.string().nullable(),
      bookable: z
        .object({
          id: z.string(),
          name: z.string(),
        })
        .nullable(),
      title: z.string(),
      description: z.string(),
      attendeeFirstName: z.string(),
      attendeeLastName: z.string(),
      attendeeEmail: z.string(),
    })
  );
  return schema.parse(response.data);
};

export const getCurrentUserBookables = async () => {
  return await axiosInstance.get<Array<Bookable>>("/bookable/user");
};

export const getBookableDetails = async (id: string) => {
  const response = await axiosInstance.get<Bookable>(`/bookable/${id}/details`);
  const bookable: Bookable = {
    ...response.data,
    availableSlots: response.data.availableSlots.map((slot) => ({
      ...slot,
      startTime: new Date(slot.startTime),
      endTime: new Date(slot.endTime),
    })),
  };
  return bookable;
};
