import { atom } from "jotai";

interface BookingDetail {
  id: string | null;
  userRole: "HOST" | "PARTICIPATOR" | "CREATOR";
  isEditing: boolean;
}

const bookingDetail = atom<BookingDetail>({
  id: null,
  isEditing: false,
  userRole: "PARTICIPATOR",
});

export default bookingDetail;
