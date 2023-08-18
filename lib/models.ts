export interface SignupDto {
  email: string;
  password: string;
  name: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface UserInfo {
  id: string;
  email: string;
  name: string;
  profileImgUrl: string;
}

export enum EventStatus {
  AVAILABLE = "AVAILABLE",
  FULL = "FULL",
  ENDED = "ENDED",
}

export enum Role {
  CREATOR = "CREATOR",
  HOST = "HOST",
  PARTICIPATOR = "PARTICIPATOR",
}

export interface TimeSlot {
  id: string;
  name?: string;
  location?: string;

  startDate: Date;
  endDate: Date;
}

export interface Bookable {
  id: string;
  name: string;
  description: string;

  timeSlots: Array<TimeSlot>;
  type: "ONE_TIME" | "RECURRING";

  attendeeFirstName?: string;
  attendeeLastName?: string;
  attendeeEmail?: string;
  attendeeBookingReferenceCode?: string;
  attendeeBookingManagementToken?: string;
}

export interface Event {
  role?: Role;
  id: string;
  name: string;
  status: EventStatus;
  participatorNum: number;
  coverImgUrl: string;
  participators?: Array<UserInfo>;
  creator?: UserInfo;
}

export interface CreateSlotDto {
  eventId: string;
  availableParticipatorNum: number;
  startDate: Date;
  endDate: Date;
  booking: boolean;
}

export enum SlotStatus {
  AVAILABLE = "AVAILABLE",
  FULL = "FULL",
  CANCELLED = "CANCELLED",
}

export interface Slot {
  participatorNum: number;
  id: string;
  availableParticipatorNum: number;
  startDate: Date;
  endDate: Date;
  booking: boolean;
  participators?: Array<UserInfo>;
  host?: UserInfo;
  event?: Event;
  status: SlotStatus;
}
