import { EventStatus, SlotStatus } from "./models";

export const computeStatusName = (status: EventStatus) => {
  switch (status) {
    case "AVAILABLE":
      return "Available";
    case "FULL":
      return "Full";
    case "ENDED":
      return "Ended";
    default:
      return "Unknown";
  }
};

export const computeSlotStatusName = (status: SlotStatus) => {
  switch (status) {
    case "AVAILABLE":
      return "Available";
    case "FULL":
      return "Full";
    case "CANCELLED":
      return "Cancelled";
    default:
      return "Unknown";
  }
};
