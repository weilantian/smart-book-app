import { AttendeeBookingDetail } from "@/lib/models";
import classes from "./BookingSuccessfulModal.module.css";
import { computeDurationText } from "@/lib/utils";
import { format } from "date-fns";
import {
  Modal,
  Stack,
  Title,
  useMantineTheme,
  Text,
  Group,
  Divider,
  Button,
  Box,
} from "@mantine/core";
import {
  IconCalendar,
  IconCalendarEvent,
  IconCircleCheck,
  IconLocation,
} from "@tabler/icons-react";
import {
  Component,
  ComponentProps,
  FC,
  PropsWithChildren,
  ReactElement,
} from "react";

const ModalDetailItem: FC<PropsWithChildren<{ icon: ReactElement }>> = ({
  icon,
  children,
}) => {
  return (
    <Group mb={4} gap={8}>
      {icon}
      <Text
        style={{
          color: "#6c757d",
        }}
      >
        {children}
      </Text>
    </Group>
  );
};

const BookingSuccessfulModal: FC<
  ComponentProps<typeof Modal> & { bookingDetail: AttendeeBookingDetail }
> = ({ bookingDetail, ...props }) => {
  const theme = useMantineTheme();
  // TODO: In this page, we add download ics feature
  return (
    <Modal closeOnEscape={false} withCloseButton={false} fullScreen {...props}>
      <Stack
        style={{
          marginTop: "10vh",
        }}
        justify="center"
        gap={4}
        align="center"
      >
        <IconCircleCheck color={theme.colors.green[6]} size={80} />

        <Title style={{ textAlign: "center" }} order={2}>
          Your booking has been scheduled
        </Title>

        {bookingDetail && (
          <>
            <Divider />

            <Box className={classes.detailCard}>
              <Box className={classes.detailCardIconContainer}>
                <IconCalendarEvent />
              </Box>
              <Box>
                <Title mb={8} order={4}>
                  {bookingDetail.bookable.name}
                </Title>
                <ModalDetailItem icon={<IconCalendar color="#6c757d" />}>
                  {format(bookingDetail.startTime, "dd/MM/yyyy hh:mm")} -{" "}
                  {format(bookingDetail.endTime, "hh:mm")}
                </ModalDetailItem>
                <ModalDetailItem icon={<IconLocation color="#6c757d" />}>
                  {bookingDetail.bookable.location}
                </ModalDetailItem>
              </Box>
            </Box>
          </>
        )}
      </Stack>
    </Modal>
  );
};

export default BookingSuccessfulModal;
