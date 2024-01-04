import { getBookable, scheduleBooking } from "@/lib/endpoint";
import {
  AttendeeBookingDetail,
  AttendeeInfo,
  BookingDetail,
  Slot,
} from "@/lib/models";
import { Box } from "@mantine/core";

import { GetServerSideProps, NextPage } from "next";
import { useEffect, useMemo, useState } from "react";
import { z } from "zod";

import classes from "@/styles/BookPage.module.css";
import BasicInfoBlock from "@/components/Book/BasicInfoBlock";
import AttendeeFormBlock from "@/components/Book/AttendeeFormBlock";
import CalendarBlock from "@/components/Book/CalendarBlock";
import SlotsBlock from "@/components/Book/SlotsBlock";
import { useDisclosure } from "@mantine/hooks";
import BookingSuccessfulModal from "@/components/Modal/BookingSuccessfulModal";
import { useRouter } from "next/router";

const BookingPage: NextPage<{ bookable: BookingDetail }> = ({ bookable }) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<{
    start: Date;
    end: Date;
  } | null>(null);

  const [bookedBookingDetail, setBookedBookingDetail] =
    useState<AttendeeBookingDetail | null>(null);

  const [opened, { open, close }] = useDisclosure(false);

  useEffect(() => {
    if (bookedBookingDetail) open();
  }, [bookedBookingDetail, open]);

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
    }).then((res) => setBookedBookingDetail(res));
  };

  const router = useRouter();

  return (
    <Box className={classes.wrapper}>
      <BookingSuccessfulModal
        onClose={() => {
          close();
        }}
        opened={opened}
        bookingDetail={bookedBookingDetail!}
      />
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

  const response = await getBookable(id);

  // Serialize the response by converting date string to Date object

  if (!response) return { notFound: true, props: {} };
  return {
    props: {
      bookable: response.data,
    },
  };
};

export default BookingPage;
