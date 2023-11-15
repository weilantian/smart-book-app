import { Box } from "@mantine/core";
import { useAtom } from "jotai";
import { FC, useEffect, useMemo, useState } from "react";
import eventManagerStore from "../../store/eventManagerStore";
import { TimeSlot } from "../../lib/models";
import { COL_HEIGHT } from "../../config";
import SlotEditPopup from "../Slots/SlotEditPopup";
import { Text } from "@mantine/core";

import classes from "./EventItem.module.css";
import bookableMachineAtom from "@/store/bookableMachineStore";
import cx from "clsx";

const EventItem: FC<{
  slot: TimeSlot;
}> = ({ slot }) => {
  const [evManager, setEvManager] = useAtom(eventManagerStore);
  useEffect(() => console.log(evManager), [evManager]);

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

  const [cursorState, setCursorState] = useState<
    "startDate" | "endDate" | "move"
  >("move");

  return (
    <SlotEditPopup slot={slot}>
      <Box
        onDoubleClick={() =>
          setEvManager((p) => ({ ...p, slotEditing: slot.id! }))
        }
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const relativePos = e.clientY - rect.top;
          if (relativePos < 10) {
            setCursorState("startDate");
          } else if (relativePos > rect.height - 10) {
            setCursorState("endDate");
          } else {
            setCursorState("move");
          }
        }}
        // onClick={() => setEvManager((p) => ({ ...p, slotEditing: slot.id! }))}
        onMouseUp={() => {}}
        onMouseDown={(e) => {
          setEvManager((p) => ({ ...p, slotIdFocused: slot.id! }));
          send({
            type: "EDIT",
            slotId: slot.id!,
            pos: computeRelativePos(e),
            editingMode: cursorState,
            date: slot.startTime,
          });
        }}
        style={{
          top,
          height,
          userSelect: "none",
          cursor: cursorState === "move" ? "grab" : "ns-resize",
        }}
        className={cx(
          classes.container,
          evManager.slotIdFocused === slot.id && classes.active
        )}
      >
        <Text truncate> {slot.name}</Text>
      </Box>
    </SlotEditPopup>
  );
};

export default EventItem;
