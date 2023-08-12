import { createStyles } from "@mantine/core";
import { useAtom } from "jotai";
import { FC, useMemo } from "react";
import eventManagerStore from "../../store/eventManagerStore";
import { TimeSlot } from "../../lib/models";

const useStyles = createStyles((theme) => ({
  container: {
    display: "flex",
    position: "absolute",
    width: "100%",
    borderRadius: theme.radius.md,
    top: 0,
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.colors.blue[8]
        : theme.colors.blue[0],
  },
}));

const EventItem: FC<{
  slot: TimeSlot;
}> = ({ slot }) => {
  const [evManager] = useAtom(eventManagerStore);
  const { classes, cx } = useStyles();

  const top = useMemo(() => {
    const hour = slot.startDate.getHours();
    const minutes = slot.startDate.getMinutes();

    return (evManager.rowHeight / 24) * (hour + minutes / 60);
  }, [evManager.rowHeight, slot]);

  const height = useMemo(() => {
    const duration = slot.endDate.getTime() - slot.startDate.getTime();
    const minutes = duration / 1000 / 60;
    return (evManager.rowHeight / 24) * (minutes / 60);
  }, [evManager.rowHeight, slot]);

  return (
    <div
      style={{
        top,
        height,
      }}
      className={cx(classes.container)}
    >
      <div>Event</div>
    </div>
  );
};

export default EventItem;
