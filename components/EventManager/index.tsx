import {
  Box,
  Button,
  createStyles,
  Flex,
  Grid,
  Group,
  Stack,
  Text,
} from "@mantine/core";
import CalenderRow from "./CalenderRow";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import {
  FC,
  use,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import DayIndicator from "./DayIndicator";
import { useResizeObserver } from "@mantine/hooks";
import { useAtom } from "jotai";
import eventManagerStore from "../../store/eventManagerStore";
import { TimeSlot } from "../../lib/models";
import useTraceUpdate from "../../hooks/useTraceUpdate";
import CurrentTimeMarker from "../CurrentTimeMarker";
import { COL_HEIGHT } from "../../config";

const DayLabel: FC<{ i: number }> = ({ i }) => {
  const text = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (i == 9) text.current?.scrollIntoView({});
  }, [i]);
  return (
    <Text
      ref={text}
      key={i}
      sx={(theme) => ({
        lineHeight: 0,
        userSelect: "none",
        fontSize: 12,
        color:
          theme.colorScheme === "dark"
            ? theme.colors.dark[3]
            : theme.colors.gray[5],
      })}
      align="end"
    >
      {i}:00
    </Text>
  );
};

const useStyles = createStyles((theme) => ({
  container: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    flex: 1,
  },
  cellHeader: {
    top: 120,
    width: "100%",
  },
  cellHeaderItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  scrollInner: {
    width: "100%",
    display: "flex",
    height: 300,
  },
}));

const EventManager: FC<{
  slots: Array<TimeSlot>;
  selectedDate: Date | null;
  setDate: (date: Date | null) => void;
}> = ({ selectedDate, setDate, slots }) => {
  const { classes, cx } = useStyles();

  //Get each day of the week of the selected date
  const currentWeek = useMemo(
    () =>
      Array.from({ length: 7 }, (_, i) => {
        const date = new Date(selectedDate ?? new Date());
        date.setDate(date.getDate() - date.getDay() + i);
        return date;
      }),
    [selectedDate]
  );

  const [, setEventManagerStore] = useAtom(eventManagerStore);
  const [gridRef, rect] = useResizeObserver();

  useEffect(() => {
    setEventManagerStore((prev) => ({
      ...prev,
      rowHeight: rect.height,
    }));
  }, [rect, setEventManagerStore]);

  const getFilteredSloByDate = useCallback(
    (displayDate: Date) =>
      slots.filter(
        (slot) => slot.startTime.getDate() === displayDate.getDate()
      ),

    [slots]
  );

  return (
    <Box className={classes.container}>
      <Group
        spacing="xs"
        sx={{
          marginBottom: 18,
        }}
        position="right"
      >
        <Button
          size="xs"
          onClick={() =>
            setDate(
              new Date(
                selectedDate?.setDate(selectedDate.getDate() - 7) ?? new Date()
              )
            )
          }
        >
          <IconChevronLeft />
        </Button>
        <Button size="xs" onClick={() => setDate(new Date())}>
          Today
        </Button>
        <Button
          size="xs"
          onClick={() =>
            setDate(
              new Date(
                selectedDate?.setDate(selectedDate.getDate() + 7) ?? new Date()
              )
            )
          }
        >
          <IconChevronRight />
        </Button>
      </Group>

      <Stack
        sx={{
          flex: 1,
        }}
      >
        <Box
          sx={{
            marginLeft: 60,
          }}
        >
          <Grid className={classes.cellHeader} columns={7}>
            {currentWeek.map((date) => {
              const day = date.toLocaleString("en-US", { day: "numeric" });
              const isToday =
                day === new Date().toLocaleString("en-US", { day: "numeric" });
              return (
                <Grid.Col key={date.toString()} span={1}>
                  <Box className={classes.cellHeaderItem}>
                    <Text
                      sx={(theme) => ({
                        color:
                          theme.colorScheme === "dark"
                            ? theme.colors.dark[3]
                            : theme.colors.gray[5],
                      })}
                    >
                      {date.toLocaleString("en-US", { weekday: "short" })}
                    </Text>
                    <DayIndicator day={day} highlighted={isToday} />
                  </Box>
                </Grid.Col>
              );
            })}
          </Grid>
        </Box>
        <Box
          sx={{
            flex: 1,
            overflowY: "scroll",
            overflowX: "hidden",
            minHeight: 0,
            flexDirection: "column",
          }}
        >
          <Box className={classes.scrollInner}>
            <Stack
              spacing={COL_HEIGHT}
              sx={{
                paddingRight: 14,
                paddingTop: 14,
              }}
            >
              {Array(24)
                .fill(0)
                .map((_, i) => (
                  <DayLabel key={i} i={i} />
                ))}
            </Stack>
            <Box
              sx={{
                flex: 1,
                paddingTop: 20,
                position: "relative",
              }}
            >
              <CurrentTimeMarker />
              <Grid ref={gridRef} columns={7}>
                {currentWeek.map((date) => (
                  <CalenderRow
                    key={date.toISOString()}
                    slots={getFilteredSloByDate(date)}
                    date={date}
                  />
                ))}
              </Grid>
            </Box>
          </Box>
        </Box>
      </Stack>
    </Box>
  );
};

export default EventManager;
