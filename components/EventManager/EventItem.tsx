import { Box } from "@mantine/core";
import { useAtom } from "jotai";
import { FC, useEffect, useMemo } from "react";
import eventManagerStore from "../../store/eventManagerStore";
import { TimeSlot } from "../../lib/models";
import { COL_HEIGHT } from "../../config";
import SlotEditPopup from "../Slots/SlotEditPopup";
import { Text } from "@mantine/core";

import classes from "./EventItem.module.css";
import bookableMachineAtom from "@/store/bookableMachineStore";

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

  const computeRelativePos = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    return e.clientY - rect.top;
  };

  const [, send] = useAtom(bookableMachineAtom);

  return (
    <SlotEditPopup slot={slot}>
      <Box
        onClick={() => (evManager.slotEditing = slot.id!)}
        onMouseDown={(e) => {
          e.stopPropagation();
          //TODO: React to dragging different borders
          send({
            type: "EDIT",
            slotId: slot.id!,
            pos: computeRelativePos(e),
          });
        }}
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
