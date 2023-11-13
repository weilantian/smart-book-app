import { Box, createStyles } from "@mantine/core";
import { useAtom } from "jotai";
import { FC, useEffect, useMemo } from "react";
import eventManagerStore from "../../store/eventManagerStore";
import { TimeSlot } from "../../lib/models";
import { COL_HEIGHT } from "../../config";
import SlotEditPopup from "../Slots/SlotEditPopup";
import { Text } from "@mantine/core";

const useStyles = createStyles((theme) => ({
  container: {
    color:
      theme.colorScheme === "dark"
        ? theme.colors.blue[0]
        : theme.colors.blue[9],
    display: "flex",
    position: "absolute",
    width: "100%",
    borderRadius: theme.radius.md,
    transition: "all 80ms ease",
    userSelect: "none",
    top: 0,
    border:
      theme.colorScheme === "dark"
        ? `1px solid ${theme.fn.darken(theme.colors.blue[7], 0.5)}`
        : `1px solid ${theme.colors.gray[0]}`,
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.fn.darken(theme.colors.blue[9], 0.5)
        : theme.colors.blue[1],
  },
}));

const EventItem: FC<{
  slot: TimeSlot;
}> = ({ slot }) => {
  const [evManager] = useAtom(eventManagerStore);
  const { classes, cx } = useStyles();

  const top = useMemo(() => {
    const hour = slot.startTime.getHours();
    const minutes = slot.startTime.getMinutes();

    return COL_HEIGHT * (hour + minutes / 60);
  }, [slot]);

  const height = useMemo(() => {
    const duration = slot.endTime.getTime() - slot.startTime.getTime();
    const minutes = duration / 1000 / 60;
    return COL_HEIGHT * (minutes / 60);
  }, [slot]);

  return (
    <SlotEditPopup slot={slot}>
      <Box
        onClick={() => (evManager.slotEditing = slot.id!)}
        onMouseDown={(e) => e.stopPropagation()}
        style={{
          top,
          height,
          userSelect: "none",
        }}
        className={cx(classes.container)}
      >
        <Text truncate> {slot.name}</Text>
      </Box>
    </SlotEditPopup>
  );
};

export default EventItem;
