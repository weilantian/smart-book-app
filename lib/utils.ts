import { EventStatus } from "./models";

export const computeStatusName = (status: EventStatus) => {
  switch (status) {
    case "ALLIABLE":
      return "Alliable";
    case "FULL":
      return "Full";
    case "ENDED":
      return "Ended";
    default:
      return "Unknown";
  }
};
