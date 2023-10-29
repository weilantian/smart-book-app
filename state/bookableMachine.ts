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
      | { type: "MOUSE_MOVED"; pos: number }
      | { type: "MOUSE_UP" }
      | { type: "NAVIGATE_TO_HOME" },
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
    },
  },
  initial: "idle",
  context: {
    slots: [],
    editingBookableId: "",
    gridHeight: 0,
    dragging: {
      draggingDate: new Date(),
      draggingStartPos: 0,
      draggingEndPos: 0,
    },
    newSlot: {
      id: uuidV4(),
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
            CREATE: {
              target: "creating",
              actions: (context, event) => {
                context.dragging.draggingDate = event.date;
                const date = computeDateByPosition(
                  context.dragging.draggingDate,
                  context.gridHeight,
                  event.pos
                );

                context.newSlot.startTime = date;
                //Set end date to 30 minutes later
                const endTime = new Date(date);
                endTime.setMinutes(context.newSlot.startTime.getMinutes() + 30);
                context.newSlot.endTime = endTime;
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
            NAVIGATE_TO_HOME: {
              target: "#bookableMachine.idle",
            },
          },
        },
        editing: {},
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
  const roundedMinutes = Math.round(minutes / 30) * 30;
  // add hours and minutes to start date

  const date = new Date(createOn);
  date.setHours(hours);
  date.setMinutes(roundedMinutes);
  return date;
};

export default bookableMachine;
