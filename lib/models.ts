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

export interface Event {
  id: string;
  name: string;
  status: EventStatus;
  participatorNum: number;
  coverImgUrl: string;
  participators?: Array<UserInfo>;
  creator?: UserInfo;
  hosts?: Array<UserInfo>;
}
