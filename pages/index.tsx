import { NextPage } from "next";

import {
  Box,
  Button,
  Collapse,
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
import { Calendar, DatePicker } from "@mantine/dates";
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
import cx from "clsx";

import classes from "@/styles/IndexPage.module.css";

const CreateBookablePage: NextPage = () => {
  const router = useRouter();
  const { isAuthorized } = useIsAuthorized();
  useEffect(() => {
    if (isAuthorized) return;
    router.push("/signin");
  }, [isAuthorized, router]);

  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [showLandscapeCalendar, setShowLandscapeCalendar] = useState(false);

  const startEndOfCurrentWeek = useMemo(() => {
    const targeStartDate = dayjs(selectedDate ?? new Date())
      .startOf("week")
      .toDate();
    const targetEndDate = dayjs(selectedDate ?? new Date())
      .endOf("week")
      .toDate();
    targeStartDate.setDate(targeStartDate.getDate() - 7);
    targetEndDate.setDate(targetEndDate.getDate() + 7);
    return {
      startDate: targeStartDate,
      endDate: targetEndDate,
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
            <Button leftSection={<IconPlus size={18} />} size="sm">
              New Booking
            </Button>
          </Link>
        }
      />
      <div className={classes.inner}>
        <Paper className={cx(classes.paper, classes.sideBar)}>
          <Group gap="xs" align="center">
            <IconCalendar />
            <Button
              onClick={() => setShowLandscapeCalendar((p) => !p)}
              size="xs"
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
            <Box
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <DatePicker
                onChange={setSelectedDate}
                value={selectedDate}
                size="sm"
              />
            </Box>
          </Collapse>

          <Box
            style={{
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
