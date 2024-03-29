import { NextPage } from "next";
import cx from "clsx";
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
} from "@tabler/icons-react";
import { DatePicker } from "@mantine/dates";
import EventManager from "@/components/EventManager";
import { Bookable, TimeSlot } from "@/lib/models";
import { useAtom } from "jotai";

import bookableMachineAtom from "@/store/bookableMachineStore";
import BookableInfoForm from "@/components/BookableInfoForm";
import SlotList from "@/components/Slots/SlotList";
import {
  createBookable,
  getBookableDetails,
  updateBookable,
} from "@/lib/endpoint";
import Head from "next/head";

import classes from "@/styles/IndexPage.module.css";
import { useDisclosure, useHotkeys } from "@mantine/hooks";
import CreateBookableSuccessfulModal from "@/components/Modal/CreateBookableSuccessfulModal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { calculateHoursAndMinutes } from "@/lib/utils";

const CreateBookablePage: NextPage = () => {
  const queryClient = useQueryClient();
  const [createdBookable, setCreatedBookable] = useState<Bookable | null>(null);
  const [opened, { open, close }] = useDisclosure(false);

  const router = useRouter();

  const { mutate, isLoading } = useMutation({
    mutationFn: updateBookable,
    mutationKey: ["bookables", router.query.id],
    onSuccess({ data }) {
      setCreatedBookable(data);
    },
  });

  const { data } = useQuery({
    queryFn: () => getBookableDetails(router.query.id as string),
    queryKey: ["bookables", router.query.id],
    refetchOnWindowFocus: false,
  });

  const formattedFormData = useMemo(() => {
    if (typeof data === "undefined") return;
    const { duration, ...bookable } = data;
    return { ...bookable, ...calculateHoursAndMinutes(duration) };
  }, [data]);

  const { isAuthorized } = useIsAuthorized();
  useEffect(() => {
    if (isAuthorized) return;
    router.push("/signin");
  }, [isAuthorized, router]);

  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  const [showLandscapeCalendar, setShowLandscapeCalendar] = useState(false);

  const [state, send] = useAtom(bookableMachineAtom);

  const computeClosetDateOfSlots = (slots: Array<TimeSlot>) => {
    const now = new Date();
    if (!slots.length) return now;
    const closestDate = slots.reduce((prev, curr) => {
      const prevDiff = Math.abs(
        new Date(prev.startTime).getTime() - now.getTime()
      );
      const currDiff = Math.abs(
        new Date(curr.startTime).getTime() - now.getTime()
      );
      return prevDiff < currDiff ? prev : curr;
    });
    return closestDate.startTime;
  };

  useEffect(() => {
    if (!data) return;
    // Set the date to the date closest to today

    setSelectedDate(computeClosetDateOfSlots(data.availableSlots));
    send({
      type: "POPULATE",
      slots: data.availableSlots,
    });
  }, [data, send]);

  const [slotsForRender, setSlotsForRender] = useState<Array<TimeSlot>>([]);

  //TODO: May use useMemo, however nextjs throw a hydration error when using useMemo due to client server time difference
  useEffect(() => {
    if (!state.matches("creatingBookable.idle") && state.context.newSlot.id) {
      setSlotsForRender([...state.context.slots, state.context.newSlot]);
      return;
    }
    setSlotsForRender([...state.context.slots]);
  }, [state, state.context.slots]);

  useEffect(() => {
    if (createdBookable) {
      open();
    }
  }, [createdBookable, open]);

  return (
    <div className={classes.container}>
      <CreateBookableSuccessfulModal
        bookable={createdBookable}
        opened={opened}
        onClose={() => {
          close();
          router.push("/");
        }}
      />
      <Head>
        <title>Create a new booking - Smart Book</title>
      </Head>
      <EventPageHeader title="Edit a booking" />
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
              overflowY: "scroll",
              flex: 1,
              flexDirection: "column",
              display: "flex",
            }}
          >
            <Box>
              <Divider my="sm" />
              <Group
                style={{
                  marginBottom: 12,
                }}
                justify="space-between"
              ></Group>
              <Box
                style={{
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
                  initialValues={formattedFormData}
                  isLoading={isLoading}
                  onSubmit={(data) => {
                    mutate({
                      ...data,

                      availableSlots: state.context.slots.map((slot) => {
                        return {
                          id: slot.id,
                          startTime: slot.startTime,
                          endTime: slot.endTime,
                        };
                      }),
                    } as Bookable);
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
