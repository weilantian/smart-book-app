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

export interface SlotDetailItem {
  title: string;
  value: string;
  icon: React.ReactNode;
}

export interface TimeSlot {
  id?: string | null;
  name?: string;
  location?: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  slotDetail?: Array<SlotDetailItem>;
}

export interface Slot {
  start: Date;
  end: Date;
}

export interface BookingDetail {
  id?: string;
  name: string;
  description: string;
  location: string;
  duration: number;
  slots: Array<{
    start: Date;
    end: Date;
  }>;
}

export interface BookingResponse {}

export interface Bookable {
  id?: string;
  name: string;
  description: string;
  duration: number;
  location: string;

  availableSlots: Array<TimeSlot>;
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
  startTime: Date;
  endTime: Date;
  booking: boolean;
}

export enum SlotStatus {
  AVAILABLE = "AVAILABLE",
  FULL = "FULL",
  CANCELLED = "CANCELLED",
}

export interface AttendeeInfo {
  attendeeFirstName: string;
  attendeeLastName: string;
  attendeeEmail: string;
}

export interface ScheduleBookingInput extends AttendeeInfo {
  startTime: string;
  endTime: string;
}

export interface BookedSlot extends AttendeeInfo {
  id: string;
  duration: number;
  startTime: Date;
  endTime: Date;
  bookableId: string | null;
  bookable: Partial<Bookable> | null;
  title: string;
  description: string;
}

export interface AttendeeBookingDetail {
  attendeeBookingReferenceCode: string;
  duration: number;
  startTime: Date;
  endTime: Date;
  bookable: {
    name: string;
    location: string;
  };
}
