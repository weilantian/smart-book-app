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

const isoDateFormat = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d*)?$/;

function isIsoDateString(value: any): boolean {
  return value && typeof value === "string" && isoDateFormat.test(value);
}

export function handleDates(body: any) {
  if (body === null || body === undefined || typeof body !== "object")
    return body;

  for (const key of Object.keys(body)) {
    const value = body[key];
    if (isIsoDateString(value)) body[key] = new Date(value);
    else if (typeof value === "object") handleDates(value);
  }
}

export const calculateDuration = ({
  hours,
  minutes,
}: {
  hours: number;
  minutes: number;
}) => (hours * 60 + minutes) * 60 * 1000;
