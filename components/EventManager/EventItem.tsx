import { Box } from "@mantine/core";
import { useAtom } from "jotai";
import { FC, useEffect, useMemo } from "react";
import eventManagerStore from "../../store/eventManagerStore";
import { TimeSlot } from "../../lib/models";
import { COL_HEIGHT } from "../../config";
import SlotEditPopup from "../Slots/SlotEditPopup";
import { Text } from "@mantine/core";

import classes from "./EventItem.module.css";

const EventItem: FC<{
  slot: TimeSlot;
}> = ({ slot }) => {
  const [evManager] = useAtom(eventManagerStore);

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
        className={classes.container}
      >
        <Text truncate> {slot.name}</Text>
      </Box>
    </SlotEditPopup>
  );
};

export default EventItem;
