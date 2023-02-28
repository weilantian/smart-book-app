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

export interface Event {
  role?: Role;
  id: string;
  name: string;
  status: EventStatus;
  participatorNum: number;
  coverImgUrl: string;
  participators?: Array<UserInfo>;
  creator?: UserInfo;
  hosts?: Array<UserInfo>;
  slots?: Array<Slot>;
}

export interface CreateSlotDto {
  eventId: string;
  availableParticipatorNum: number;
  startDate: Date;
  endDate: Date;
  booking: boolean;
}

export interface Slot {
  id: string;
  availableParticipatorNum: number;
  startDate: Date;
  endDate: Date;
  booking: boolean;
  participators?: Array<UserInfo>;
  creator?: UserInfo;
  event?: Event;
}
