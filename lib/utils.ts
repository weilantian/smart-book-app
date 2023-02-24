import { EventStatus } from "./models";

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
