import { Box, createStyles, Grid, Text } from "@mantine/core";
import { FC, use, useContext, useEffect } from "react";
import EventItem from "./EventItem";
import { TimeSlot } from "../../lib/models";
import { useAtom } from "jotai";

import useTraceUpdate from "../../hooks/useTraceUpdate";
import { BookableMachineContext } from "../../contexts/BookableMachineContext";
import { useActor } from "@xstate/react";

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
        height: 60,
        borderLeft: `1px solid ${
          theme.colorScheme === "dark"
            ? theme.colors.dark[4]
            : theme.colors.gray[2]
        }`,
        borderRight: `1px solid ${
          theme.colorScheme === "dark"
            ? theme.colors.dark[4]
            : theme.colors.gray[2]
        }`,
        borderBottom: `1px solid ${
          theme.colorScheme === "dark"
            ? theme.colors.dark[5]
            : theme.colors.gray[1]
        }`,
        borderTop: `1px solid ${
          theme.colorScheme === "dark"
            ? theme.colors.dark[5]
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
  const bookableService = useContext(BookableMachineContext);
  const [state] = useActor(bookableService!);
  const computeRelativePos = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    return e.clientY - rect.top;
  };

  return (
    <Grid.Col
      onMouseDown={(e) => {
        console.log(computeRelativePos(e));
        bookableService!.send({
          type: "CREATE",
          date: date,
          pos: computeRelativePos(e),
        });
      }}
      onMouseMove={(e) => {
        bookableService!.send({
          type: "MOUSE_MOVED",
          pos: computeRelativePos(e),
        });
      }}
      onMouseUp={() =>
        bookableService!.send({
          type: "MOUSE_UP",
        })
      }
      sx={{
        padding: 0,
        position: "relative",
      }}
      span={1}
    >
      {slots.map((slot) => (
        <EventItem slot={slot} key={slot.id} />
      ))}

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
