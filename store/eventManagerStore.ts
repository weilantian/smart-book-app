import { atom } from "jotai";
import { v4 as uuidv4 } from "uuid";
import { TimeSlot } from "../lib/models";
const eventManagerStore = atom<{
  slotEditing: string | null;
  slotIdFocused: string | null;
}>({
  slotEditing: null,
  slotIdFocused: null,
});

export default eventManagerStore;
