import { getBookable, scheduleBooking } from "@/lib/endpoint";
import {
  AttendeeBookingDetail,
  AttendeeInfo,
  BookingDetail,
  Slot,
} from "@/lib/models";
import { Box, Loader, LoadingOverlay } from "@mantine/core";

import { GetServerSideProps, GetStaticProps, NextPage } from "next";
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
import { useQuery } from "@tanstack/react-query";

const BookingPage: NextPage = () => {
  const router = useRouter();

  const { id } = router.query;

  const { data, isLoading } = useQuery({
    queryKey: ["bookable", id],
    queryFn: () => getBookable(id as string),
  });

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
    if (!data?.data.slots) return [];

    const bookingSlotSchema = z.array(
      z.object({
        start: z.string().transform((val) => new Date(val)),
        end: z.string().transform((val) => new Date(val)),
      })
    );
    const slots = bookingSlotSchema.parse(data?.data.slots);
    return slots;
  }, [data]);

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
    scheduleBooking(data?.data.id!, {
      ...attendeeInfo,
      startTime: selectedSlot?.start.toISOString(),
      endTime: selectedSlot?.end.toISOString(),
    }).then((res) => setBookedBookingDetail(res));
  };

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
        <LoadingOverlay
          visible={isLoading}
          zIndex={1000}
          overlayProps={{ radius: "sm", blur: 2 }}
        />

        {!isLoading && (
          <BasicInfoBlock
            resetSelectedSlot={() => {
              setSelectedSlot(null);
            }}
            bookable={data?.data!}
            selectedSlot={selectedSlot}
          />
        )}

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

// export const getStaticPaths = async () => {}

// export const getStaticProps: GetStaticProps = async ({ params }) => {
//   const id = params?.id as string;
//   if (!id) throw new Error("No id provided");

//   const response = await getBookable(id);

//   // Serialize the response by converting date string to Date object

//   if (!response) return { notFound: true, props: {} };
//   return {
//     props: {
//       bookable: response.data,
//     },
//   };
// };

// export const getServerSideProps: GetServerSideProps = async ({ params }) => {
//   const id = params?.id as string;
//   if (!id) throw new Error("No id provided");

//   const response = await getBookable(id);

//   // Serialize the response by converting date string to Date object

//   if (!response) return { notFound: true, props: {} };
//   return {
//     props: {
//       bookable: response.data,
//     },
//   };
// };

export default BookingPage;
