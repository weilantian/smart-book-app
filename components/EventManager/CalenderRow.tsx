import { Box, Grid, Text } from "@mantine/core";
import { FC } from "react";
import EventItem from "./EventItem";
import { TimeSlot } from "../../lib/models";
import { useAtom } from "jotai";

import bookableMachineAtom from "../../store/bookableMachineStore";
import { COL_HEIGHT } from "../../config";
import eventManagerStore from "../../store/eventManagerStore";

import classes from "./CalendarRow.module.css";

const Cell = () => {
  return (
    <Box
      className={classes.cell}
      style={{
        height: COL_HEIGHT,
      }}
    ></Box>
  );
};

const CalendarRow: FC<{
  date: Date;
  slots: Array<TimeSlot>;
}> = ({ date, slots }) => {
  const [, send] = useAtom(bookableMachineAtom);
  const [eventManager, setEventManager] = useAtom(eventManagerStore);

  const computeRelativePos = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    return e.clientY - rect.top;
  };

  return (
    <Box
      onMouseDown={(e) => {
        e.preventDefault();
        if (eventManager.slotEditing !== null) {
          if (e.target !== e.currentTarget) return;
          setEventManager({ ...eventManager, slotEditing: null });
          return;
        }

        send({
          type: "CREATE",
          date: date,
          pos: computeRelativePos(e),
        });
      }}
      onMouseMove={(e) => {
        e.preventDefault();
        send({
          type: "MOUSE_MOVED",
          pos: computeRelativePos(e),
          date: date,
        });
      }}
      onMouseUp={() =>
        send({
          type: "MOUSE_UP",
        })
      }
      style={{
        padding: 0,
        position: "relative",
        flex: 1,
        userSelect: "none",
      }}
    >
      {slots.map((slot) => {
        return <EventItem slot={{ ...slot }} key={slot.id} />;
      })}

      <Box
        style={{
          userSelect: "none",
        }}
      >
        {Array(23)
          .fill(0)
          .map((_, i) => (
            <Cell key={i} />
          ))}
      </Box>
    </Box>
  );
};

export default CalendarRow;
