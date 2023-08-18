import { Box, createStyles, Grid, Text } from "@mantine/core";
import { FC, use, useContext, useEffect, useState } from "react";
import EventItem from "./EventItem";
import { TimeSlot } from "../../lib/models";
import { useAtom } from "jotai";
import { v4 } from "uuid";

import useTraceUpdate from "../../hooks/useTraceUpdate";

import bookableMachineAtom from "../../store/bookableMachineStore";
import { COL_HEIGHT } from "../../config";

const useStyles = createStyles((theme) => ({
  header: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
}));

const Cell = () => {
  return (
    <Box
      sx={(theme) => ({
        height: COL_HEIGHT,
        border: `1px solid ${
          theme.colorScheme === "dark"
            ? theme.colors.dark[4]
            : theme.colors.gray[1]
        }`,
      })}
    ></Box>
  );
};

const CalendarRow: FC<{
  date: Date;
  slots: Array<TimeSlot>;
}> = ({ date, slots }) => {
  const [, send] = useAtom(bookableMachineAtom);

  const computeRelativePos = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    return e.clientY - rect.top;
  };

  return (
    <Grid.Col
      onMouseDown={(e) => {
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
      sx={{
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
