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
import { useEffect, useState } from "react";
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
import { createBookable } from "@/lib/endpoint";
import Head from "next/head";

import classes from "@/styles/IndexPage.module.css";
import { useDisclosure, useHotkeys } from "@mantine/hooks";
import CreateBookableSuccessfulModal from "@/components/Modal/CreateBookableSuccessfulModal";
import { useMutation } from "@tanstack/react-query";

const CreateBookablePage: NextPage = () => {
  const [createdBookable, setCreatedBookable] = useState<Bookable | null>(null);
  const [opened, { open, close }] = useDisclosure(false);

  const { mutate, isLoading } = useMutation({
    mutationFn: createBookable,
    onSuccess({ data }) {
      setCreatedBookable(data);
    },
  });

  const router = useRouter();
  const { isAuthorized } = useIsAuthorized();
  useEffect(() => {
    if (isAuthorized) return;
    router.push("/signin");
  }, [isAuthorized, router]);

  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  const [showLandscapeCalendar, setShowLandscapeCalendar] = useState(false);

  const [state, send] = useAtom(bookableMachineAtom);

  const [slotsForRender, setSlotsForRender] = useState<Array<TimeSlot>>([]);

  //TODO: May use useMemo, however nextjs throw a hydration error when using useMemo due to client server time difference
  useEffect(() => {
    if (!state.matches("creatingBookable.idle") && state.context.newSlot.id) {
      console.log(state.context.newSlot.id);
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
      <EventPageHeader title="Create a new Booking" />
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
                  isLoading={isLoading}
                  onSubmit={(data) => {
                    mutate({
                      ...data,

                      availableSlots: state.context.slots.map((slot) => {
                        return {
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
