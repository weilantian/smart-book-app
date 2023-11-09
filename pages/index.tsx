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
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import {
  IconCalendar,
  IconChevronDown,
  IconChevronRight,
  IconPlus,
  IconUser,
} from "@tabler/icons-react";
import { Calendar } from "@mantine/dates";
import EventManager from "@/components/EventManager";
import { Bookable, TimeSlot } from "@/lib/models";
import { useAtom } from "jotai";

import bookableMachineAtom from "@/store/bookableMachineStore";
import BookableInfoForm from "@/components/BookableInfoForm";
import SlotList from "@/components/Slots/SlotList";
import { createBookable, getCurrentUserBookings } from "@/lib/endpoint";
import Head from "next/head";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import dayjs from "dayjs";

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

  const startEndOfCurrentWeek = useMemo(() => {
    return {
      startDate: dayjs(selectedDate ?? new Date())
        .startOf("week")
        .toDate(),
      endDate: dayjs(selectedDate ?? new Date())
        .endOf("week")
        .toDate(),
    };
  }, [selectedDate]);

  const [state, send] = useAtom(bookableMachineAtom);

  const [slotsForRender, setSlotsForRender] = useState<Array<TimeSlot>>([]);

  const { data } = useQuery({
    queryFn: () => getCurrentUserBookings(startEndOfCurrentWeek),
    queryKey: ["bookings", startEndOfCurrentWeek],
  });

  //TODO: May use useMemo, however nextjs throw a hydration error when using useMemo due to client server time difference
  useEffect(() => {
    if (!data) return;

    setSlotsForRender(
      data.map((slot) => ({
        ...slot,
        name: `${slot.bookable.name}`,
        slotDetail: [
          {
            title: "Booked by",
            icon: <IconUser />,
            value: slot.attendeeFirstName + " " + slot.attendeeLastName,
          },
        ],
      }))
    );
  }, [data]);

  return (
    <div className={classes.container}>
      <Head>
        <title>Smart Book</title>
      </Head>
      <EventPageHeader
        home
        widgets={
          <Link href="/bookable/create">
            <Button leftIcon={<IconPlus size={18} />} size="sm">
              New Booking
            </Button>
          </Link>
        }
      />
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
          ></Box>
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
