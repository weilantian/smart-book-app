import { atom } from "jotai";
import { v4 as uuidv4 } from "uuid";
import { TimeSlot } from "../lib/models";
const eventManagerStore = atom<{
  rowHeight: number;
}>({
  rowHeight: 0,
});

export default eventManagerStore;
