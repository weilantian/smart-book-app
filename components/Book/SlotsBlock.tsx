import { Slot } from "@/lib/models";
import { Box, Title, Stack, Text, UnstyledButton } from "@mantine/core";
import { FC } from "react";
import classes from "@/styles/BookPage.module.css";
import { format } from "date-fns";

const SlotItem: FC<{ slot: Slot; onClick: (slot: Slot) => void }> = ({
  slot,
  onClick,
}) => {
  return (
    <UnstyledButton onClick={() => onClick(slot)} className={classes.slotItem}>
      {format(slot.start, "hh:mm a..aa")} - {format(slot.end, "hh:mm a..aa")}
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

export default SlotsBlock;
