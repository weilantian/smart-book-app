import { getBookableDetails, scheduleBooking } from "@/lib/endpoint";
import { AttendeeInfo, Bookable, BookingDetail, Slot } from "@/lib/models";
import { computeDurationText } from "@/lib/utils";
import {
  Box,
  Title,
  Text,
  Group,
  UnstyledButton,
  Indicator,
  Stack,
  TextInput,
  Button,
} from "@mantine/core";
import { DatePicker, DateValue } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { IconCalendar, IconClock } from "@tabler/icons-react";
import { GetServerSideProps, NextPage } from "next";
import { FC, useMemo, useState } from "react";
import { z } from "zod";

import classes from "@/styles/BookPage.module.css";

const BasicInfoBlock: FC<{
  bookable: BookingDetail;
  selectedSlot?: {
    start: Date;
    end: Date;
  } | null;
  resetSelectedSlot?: () => void;
}> = ({ bookable, selectedSlot, resetSelectedSlot }) => {
  return (
    <Box
      style={{
        paddingTop: 16,
        paddingLeft: 16,
      }}
      className={classes.block}
    >
      <Title order={3}>{bookable.name}</Title>
      <Text>{bookable.description}</Text>
      <Group style={{ marginTop: 8 }} gap={6}>
        <IconClock color="gray" />
        <Text>{computeDurationText(bookable.duration)}</Text>
      </Group>
      {selectedSlot && (
        <UnstyledButton onClick={resetSelectedSlot}>
          <Group
            style={{
              marginTop: 8,
              color: "var(--mantine-color-blue-7)",
              cursor: "pointer",
              fontWeight: 500,
            }}
            gap={6}
          >
            <IconCalendar />
            <Text>
              {selectedSlot.start.toLocaleDateString("en-AU", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}{" "}
              {selectedSlot.start.toLocaleTimeString()} -{" "}
              {selectedSlot.end.toLocaleTimeString()}
            </Text>
          </Group>
        </UnstyledButton>
      )}
    </Box>
  );
};

const AttendeeFormBlock: FC<{
  onSubmit: (values: AttendeeInfo) => void;
}> = ({ onSubmit }) => {
  const form = useForm({
    initialValues: {
      attendeeFirstName: "",
      attendeeLastName: "",
      attendeeEmail: "",
    },
    validate: {
      attendeeEmail: (value) =>
        /^\S+@\S+$/.test(value) ? null : "Please enter a valid email",
      attendeeFirstName: (value) =>
        value.length ? null : "Please enter your first name",
      attendeeLastName: (value) =>
        value.length ? null : "Please enter your last name",
    },
  });

  return (
    <Box
      style={{
        paddingLeft: 16,
        paddingRight: 16,
        paddingTop: 16,
      }}
      className={classes.block}
    >
      <form onSubmit={form.onSubmit(onSubmit)}>
        <TextInput
          {...form.getInputProps("attendeeFirstName")}
          withAsterisk
          label="First Name"
          placeholder="John"
        />
        <TextInput
          {...form.getInputProps("attendeeLastName")}
          mt="md"
          withAsterisk
          label="Last Name"
          placeholder="Doe"
        />
        <TextInput
          {...form.getInputProps("attendeeEmail")}
          mt="md"
          withAsterisk
          label="Email"
          placeholder="your@email.com"
        />
        <Button mt="md" type="submit" color="blue">
          Confirm
        </Button>
      </form>
    </Box>
  );
};

const CalendarBlock: FC<{
  availableDates: Date[];
  date?: Date | null;
  setDate: (date: DateValue) => void;
}> = ({ date, setDate, availableDates }) => {
  return (
    <Box
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
      className={classes.block}
    >
      <DatePicker
        renderDay={(date) => {
          const day = date.getDate();
          const isAvailable =
            availableDates?.find((d) => d.getDate() === date.getDate()) !==
            undefined;
          return isAvailable ? (
            <Indicator size={6} color="green" offset={-4}>
              {day}
            </Indicator>
          ) : (
            day
          );
        }}
        size="md"
        onChange={setDate}
        value={date}
      />
    </Box>
  );
};

const SlotItem: FC<{ slot: Slot; onClick: (slot: Slot) => void }> = ({
  slot,
  onClick,
}) => {
  return (
    <UnstyledButton onClick={() => onClick(slot)} className={classes.slotItem}>
      {slot.start.toLocaleTimeString()} - {slot.end.toLocaleTimeString()}
    </UnstyledButton>
  );
};

const SlotsBlock: FC<{
  title: string;
  slots: Array<Slot>;
  onSelectSlot: (slot: Slot) => void;
}> = ({ title, slots, onSelectSlot }) => {
  return (
    <Box
      style={{
        display: "flex",
        flexDirection: "column",
      }}
      className={classes.block}
    >
      <Title order={4}>{title}</Title>
      <Box
        style={{
          marginTop: 12,
          height: "100%",
          overflowY: "scroll",
        }}
      >
        {slots.length ? (
          <Stack>
            {slots.map((slot) => (
              <SlotItem
                key={JSON.stringify(slot)}
                onClick={onSelectSlot}
                slot={slot}
              />
            ))}
          </Stack>
        ) : (
          <Box>
            <Text
              style={{
                width: "70%",
                color: "gray",
              }}
            >
              There is no slots available for today, please try another date.
            </Text>
          </Box>
        )}
      </Box>
    </Box>
  );
};

const BookingPage: NextPage<{ bookable: BookingDetail }> = ({ bookable }) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<{
    start: Date;
    end: Date;
  } | null>(null);

  const availableSlots = useMemo<Array<Slot>>(() => {
    const bookingSlotSchema = z.array(
      z.object({
        start: z.string().transform((val) => new Date(val)),
        end: z.string().transform((val) => new Date(val)),
      })
    );
    const slots = bookingSlotSchema.parse(bookable.slots);
    return slots;
  }, [bookable]);

  const availableDates = useMemo(
    () =>
      availableSlots.reduce<Date[]>((acc, slot) => {
        const date = new Date(slot.start);
        if (acc.find((d) => d.getDate() === date.getDate())) return acc;
        return [...acc, date];
      }, []),
    [availableSlots]
  );

  const slotOfSelectedDate = useMemo(() => {
    if (!selectedDate) return null;
    return availableSlots.filter(
      (slot) => slot.start.getDate() === selectedDate.getDate()
    );
  }, [availableSlots, selectedDate]);

  const dateTimeFinalized = selectedSlot !== null;

  const handleScheduleBooking = (attendeeInfo: AttendeeInfo) => {
    if (!selectedSlot) return;
    scheduleBooking(bookable.id!, {
      ...attendeeInfo,
      startTime: selectedSlot?.start.toISOString(),
      endTime: selectedSlot?.end.toISOString(),
    }).then((res) => console.log(res));
  };

  return (
    <Box className={classes.wrapper}>
      <Box className={classes.container}>
        <BasicInfoBlock
          resetSelectedSlot={() => {
            setSelectedSlot(null);
          }}
          bookable={bookable}
          selectedSlot={selectedSlot}
        />
        {dateTimeFinalized && (
          <AttendeeFormBlock onSubmit={handleScheduleBooking} />
        )}
        {!dateTimeFinalized && (
          <>
            <CalendarBlock
              availableDates={availableDates}
              date={selectedDate}
              setDate={setSelectedDate}
            />
            {slotOfSelectedDate && (
              <SlotsBlock
                onSelectSlot={(slot) => setSelectedSlot(slot)}
                title={
                  selectedDate?.toLocaleDateString("en-AU", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }) ?? ""
                }
                slots={slotOfSelectedDate}
              />
            )}
          </>
        )}
      </Box>
    </Box>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const id = params?.id as string;
  if (!id) throw new Error("No id provided");

  const response = await getBookableDetails(id);

  // Serialize the response by converting date string to Date object

  if (!response) return { notFound: true, props: {} };
  return {
    props: {
      bookable: response.data,
    },
  };
};

export default BookingPage;
