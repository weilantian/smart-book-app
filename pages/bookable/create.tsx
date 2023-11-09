import { NextPage } from "next";

import {
  Box,
  Button,
  Collapse,
  createStyles,
  Divider,
  Group,
  Paper,
  Title,
} from "@mantine/core";
import EventPageHeader from "@/components/EventPageHeader";
import useIsAuthorized from "@/hooks/useIsAuthroized";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  IconCalendar,
  IconChevronDown,
  IconChevronRight,
} from "@tabler/icons-react";
import { Calendar } from "@mantine/dates";
import EventManager from "@/components/EventManager";
import { Bookable, TimeSlot } from "@/lib/models";
import { useAtom } from "jotai";

import bookableMachineAtom from "@/store/bookableMachineStore";
import BookableInfoForm from "@/components/BookableInfoForm";
import SlotList from "@/components/Slots/SlotList";
import { createBookable } from "@/lib/endpoint";
import Head from "next/head";

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
    height: "80%",
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

const CreateBookablePage: NextPage = () => {
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

  const [slotsForRender, setSlotsForRender] = useState<Array<TimeSlot>>([]);

  //TODO: May use useMemo, however nextjs throw a hydration error when using useMemo due to client server time difference
  useEffect(() => {
    if (!state.matches("creatingBookable.idle")) {
      setSlotsForRender([...state.context.slots, state.context.newSlot]);
      return;
    }
    setSlotsForRender([...state.context.slots]);
  }, [state, state.context.slots]);

  return (
    <div className={classes.container}>
      <Head>
        <title>Create a new booking - Smart Book</title>
      </Head>
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
              overflowY: "scroll",
              flex: 1,
              flexDirection: "column",
              display: "flex",
            }}
          >
            <Box sx={{}}>
              <Divider my="sm" />
              <Group
                sx={{
                  marginBottom: 12,
                }}
                position="apart"
              ></Group>
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
                <BookableInfoForm
                  onSubmit={(data) => {
                    createBookable({
                      ...data,

                      availableSlots: state.context.slots.map((slot) => {
                        return {
                          startTime: slot.startTime,
                          endTime: slot.endTime,
                        };
                      }),
                    } as Bookable).then((response) =>
                      console.log(response.data)
                    );
                  }}
                />
              </Box>
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

export default CreateBookablePage;
