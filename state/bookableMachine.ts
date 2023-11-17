import { createMachine } from "xstate";
import { v4 as uuidV4 } from "uuid";
import { TimeSlot } from "../lib/models";
import { COL_HEIGHT } from "../config";
const bookableMachine = createMachine({
  id: "bookableMachine",

  schema: {
    events: {} as
      | { type: "CREATE_BOOKABLE"; gridHeight: number }
      | { type: "CREATE"; date: Date; pos: number }
      | { type: "MOUSE_MOVED"; pos: number; date: Date }
      | { type: "MOUSE_UP" }
      | { type: "NAVIGATE_TO_HOME" }
      | {
          type: "EDIT";
          slotId: string;
          pos: number;
          editingMode: "startDate" | "endDate" | "move";
          date: Date;
        }
      | { type: "DELETE"; slotId: string }
      | {
          type: "POPULATE";
          slots: Array<TimeSlot>;
        },
    context: {} as {
      slots: Array<TimeSlot>;
      newSlot: TimeSlot;
      editingBookableId: string;
      gridHeight: number;
      dragging: {
        draggingDate: Date;
        draggingStartPos: number;
        draggingEndPos: number;
      };
      editingMode: "startDate" | "endDate" | "move";
      slotRelativeDragTime: Date | null;
    },
  },
  initial: "idle",
  context: {
    slotRelativeDragTime: null,
    editingMode: "endDate",
    slots: [],
    editingBookableId: "",
    gridHeight: 0,
    dragging: {
      draggingDate: new Date(),
      draggingStartPos: 0,
      draggingEndPos: 0,
    },
    newSlot: {
      id: null,
      name: "Available Slot",
      description: "",
      startTime: new Date(),
      endTime: new Date(),
    },
  },
  states: {
    idle: {
      on: {
        CREATE_BOOKABLE: {
          target: "creatingBookable",
          actions: (context, event) => {
            context.gridHeight = event.gridHeight;
          },
        },
      },
    },
    creatingBookable: {
      initial: "idle",

      states: {
        idle: {
          on: {
            DELETE: {
              target: "idle",
              actions: (context, event) => {
                context.slots = context.slots.filter(
                  (s) => s.id !== event.slotId
                );
              },
            },
            POPULATE: {
              actions: (context, event) => {
                context.slots = [
                  ...event.slots.map((s) => ({
                    ...s,
                    name: "Available slot",
                  })),
                ];
              },
            },
            EDIT: {
              target: "editing",
              actions: (context, event) => {
                context.dragging.draggingDate = event.date;
                //TODO: If click and hold on the top, mutate on the start date. If click and hold on the center, move the whole event. If click and hold on the bottom, mutate on the end date.
                //TODO: We also need to provide cursor feedback to the user.
                context.newSlot =
                  context.slots.find((s) => s.id === event.slotId) ??
                  context.newSlot;
                context.slots = context.slots.filter(
                  (s) => s.id !== event.slotId
                );
                context.editingMode = event.editingMode;
              },
            },
            CREATE: {
              target: "creating",
              actions: (context, event) => {
                context.dragging.draggingDate = event.date;
                const date = computeDateByPosition(
                  context.dragging.draggingDate,
                  context.gridHeight,
                  event.pos
                );
                context.newSlot.id = uuidV4();
                context.newSlot.startTime = date;
                //Set end date to 30 minutes later
                const endTime = new Date(date);
                endTime.setMinutes(context.newSlot.startTime.getMinutes() + 30);
                context.newSlot.endTime = endTime;
              },
            },

            NAVIGATE_TO_HOME: {
              target: "#bookableMachine.idle",
              actions: (context) => {
                context.slots = [];
                context.newSlot = {
                  id: uuidV4(),
                  name: "Available Slot",
                  description: "",
                  startTime: new Date(),
                  endTime: new Date(),
                };
              },
            },
          },
        },
        creating: {
          on: {
            MOUSE_MOVED: {
              target: "creating",
              actions: (context, event) => {
                const date = computeDateByPosition(
                  context.dragging.draggingDate,
                  context.gridHeight,
                  event.pos
                );
                if (date.getTime() == context.newSlot.startTime.getTime()) {
                  return;
                }
                context.newSlot.endTime = date;
              },
            },
            MOUSE_UP: {
              target: "idle",
              actions: (context, event) => {
                console.log("M END");
                context.newSlot.id = uuidV4();
                context.slots.push(context.newSlot);
                context.newSlot = {
                  id: uuidV4(),
                  name: "Available Slot",
                  description: "",
                  startTime: new Date(),
                  endTime: new Date(),
                };
              },
            },
          },
        },
        editing: {
          on: {
            MOUSE_MOVED: {
              target: "editing",
              actions: (context, event) => {
                const date = computeDateByPosition(
                  event.date,
                  context.gridHeight,
                  event.pos
                );

                if (context.editingMode === "startDate") {
                  if (date.getTime() == context.newSlot.endTime.getTime()) {
                    return;
                  }
                  context.newSlot.startTime = date;
                } else if (context.editingMode === "endDate") {
                  if (date.getTime() == context.newSlot.startTime.getTime()) {
                    return;
                  }
                  context.newSlot.endTime = date;
                } else {
                  if (!context.slotRelativeDragTime) {
                    context.slotRelativeDragTime = date;
                    return;
                  }
                  const diff =
                    date.getTime() - context.slotRelativeDragTime.getTime();
                  const newStartTime = new Date(
                    context.newSlot.startTime.getTime() + diff
                  );
                  const newEndTime = new Date(
                    context.newSlot.endTime.getTime() + diff
                  );
                  context.slotRelativeDragTime = date;
                  context.newSlot.startTime = newStartTime;
                  context.newSlot.endTime = newEndTime;
                }
              },
            },
            MOUSE_UP: {
              target: "idle",
              actions: (context, event) => {
                //context.newSlot.id = uuidV4();
                context.slots.push(context.newSlot);
                context.newSlot = {
                  id: uuidV4(),
                  name: "Available Slot",
                  description: "",
                  startTime: new Date(),
                  endTime: new Date(),
                };
                context.slotRelativeDragTime = null;
              },
            },
          },
        },
      },
    },
  },
});

const computeDateByPosition = (
  createOn: Date,
  gridHeight: number,
  pos: number
) => {
  const bookableHours = (pos / (24 * COL_HEIGHT)) * 24;

  // computer hours and minutes
  const hours = Math.floor(bookableHours);
  const minutes = Math.floor((bookableHours - hours) * 60);
  // make minutes a multiple of 30
  const roundedMinutes = Math.round(minutes / 15) * 15;
  // add hours and minutes to start date

  const date = new Date(createOn);
  date.setHours(hours);
  date.setMinutes(roundedMinutes);
  return date;
};

export default bookableMachine;
