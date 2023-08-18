import { NextPage } from "next";

import {
  Box,
  Button,
  Collapse,
  createStyles,
  Divider,
  Group,
  Paper,
  Stack,
  TextInput,
  Title,
} from "@mantine/core";
import EventPageHeader from "../components/EventPageHeader";
import useIsAuthorized from "../hooks/useIsAuthroized";
import { useContext, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import {
  IconCalendar,
  IconChevronDown,
  IconChevronRight,
  IconHeading,
  IconLocation,
} from "@tabler/icons-react";
import { Calendar } from "@mantine/dates";
import EventManager from "../components/EventManager";
import { TimeSlot } from "../lib/models";
import { useAtom } from "jotai";
import eventManagerStore from "../store/eventManagerStore";

import useTraceUpdate from "../hooks/useTraceUpdate";

import { useActor } from "@xstate/react";
import bookableMachine from "../state/bookableMachine";
import bookableMachineAtom from "../store/bookableMachineStore";
import BookableInfoForm from "../components/BookableInfoForm";
import SlotList from "../components/Slots/SlotList";

const useStyles = createStyles((theme) => ({
  container: {
    display: "flex",
    flexDirection: "column",

    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.colors.dark[7]
        : theme.colors.gray[0],
    width: "100%",
    height: "100vh",
    boxSizing: "border-box",
  },
  inner: {
    flex: 1,
    gap: 14,
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing.md,
    paddingLeft: theme.spacing.lg,
    paddingRight: theme.spacing.lg,
    display: "flex",
    boxSizing: "border-box",

    alignItems: "stretch",
  },
  paper: {
    boxSizing: "border-box",
    border: `1px solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[2]
    }`,
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.colors.white,
  },
  sideBar: {
    gap: 0,
    display: "flex",
    flexDirection: "column",
    width: 310,
    boxSizing: "border-box",
  },
  main: {
    flex: 1,
    width: "100%",
    display: "flex",
    flexDirection: "column",
    boxSizing: "border-box",
  },
}));

const IndexPage: NextPage = () => {
  const router = useRouter();
  const { isAuthorized } = useIsAuthorized();
  useEffect(() => {
    if (isAuthorized) return;
    router.push("/signin");
  }, [isAuthorized, router]);
  const { classes, cx } = useStyles();
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [showLandscapeCalendar, setShowLandscapeCalendar] = useState(false);

  const [state, send] = useAtom(bookableMachineAtom);

  const slotsForRender = useMemo<Array<TimeSlot>>(() => {
    if (!state.matches("creatingBookable.idle"))
      return [...state.context.slots, state.context.newSlot];

    return [...state.context.slots];
  }, [state]);

  useEffect(() => send("CREATE_BOOKABLE"), [send]);

  return (
    <div className={classes.container}>
      <EventPageHeader title="Create a new Booking" />
      <div className={classes.inner}>
        <Paper className={cx(classes.paper, classes.sideBar)}>
          <Group spacing="xs" align="center">
            <IconCalendar />
            <Button
              onClick={() => setShowLandscapeCalendar((p) => !p)}
              size="xs"
              compact
              variant="light"
            >
              {showLandscapeCalendar ? (
                <IconChevronDown size={18} />
              ) : (
                <IconChevronRight size={18} />
              )}
            </Button>
          </Group>
          <Collapse in={showLandscapeCalendar}>
            <Box>
              <Calendar
                onChange={setSelectedDate}
                value={selectedDate}
                size="sm"
              />
            </Box>
          </Collapse>

          <Box
            sx={{
              flex: 1,
              flexDirection: "column",
              display: "flex",
            }}
          >
            <Divider my="sm" />
            <Group
              sx={{
                marginBottom: 12,
              }}
              position="apart"
            >
              <Title order={4}>New Booking</Title>
            </Group>
            <Box
              sx={{
                flex: 1,

                overflowY: "scroll",
                minHeight: 0,
                paddingRight: 8,
              }}
            >
              <Title
                style={{
                  marginBottom: 4,
                }}
                order={6}
              >
                When I will be available
              </Title>
              <SlotList slots={slotsForRender} />
              <Divider my="sm" />
              <BookableInfoForm onSubmit={() => {}} />
            </Box>
          </Box>
        </Paper>
        <Paper className={cx(classes.paper, classes.main)}>
          <EventManager
            slots={slotsForRender}
            setDate={setSelectedDate}
            selectedDate={selectedDate}
          />
        </Paper>
      </div>
    </div>
  );
};

export default IndexPage;
