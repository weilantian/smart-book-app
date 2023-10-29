import { Box, createStyles } from "@mantine/core";
import { useAtom } from "jotai";
import { FC, useEffect, useMemo } from "react";
import eventManagerStore from "../../store/eventManagerStore";
import { TimeSlot } from "../../lib/models";
import { COL_HEIGHT } from "../../config";
import SlotEditPopup from "../Slots/SlotEditPopup";

const useStyles = createStyles((theme) => ({
  container: {
    display: "flex",
    position: "absolute",
    width: "100%",
    borderRadius: theme.radius.md,
    top: 0,
    border:
      theme.colorScheme === "dark"
        ? `1px solid ${theme.colors.gray[7]}`
        : `1px solid ${theme.colors.gray[0]}`,
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.colors.dark[5]
        : theme.colors.gray[1],
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
    <SlotEditPopup slotId={slot.id!}>
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
        <div>Event</div>
      </Box>
    </SlotEditPopup>
  );
};

export default EventItem;
