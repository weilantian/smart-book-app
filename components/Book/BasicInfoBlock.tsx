import { BookingDetail } from "@/lib/models";
import { computeDurationText } from "@/lib/utils";
import { Box, Title, Group, UnstyledButton, Text } from "@mantine/core";
import { IconClock, IconCalendar } from "@tabler/icons-react";
import { FC } from "react";

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

export default BasicInfoBlock;
