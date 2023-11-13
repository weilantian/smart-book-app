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
    <Grid.Col
      onMouseDown={(e) => {
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
        send({
          type: "MOUSE_MOVED",
          pos: computeRelativePos(e),
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
      }}
      span={1}
    >
      {slots.map((slot) => {
        return <EventItem slot={{ ...slot }} key={slot.id} />;
      })}

      <Box>
        {Array(23)
          .fill(0)
          .map((_, i) => (
            <Cell key={i} />
          ))}
      </Box>
    </Grid.Col>
  );
};

export default CalendarRow;
