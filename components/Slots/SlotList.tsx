import { Box, Group, Text, Flex, Alert } from "@mantine/core";
import { FC, PropsWithChildren, ReactElement } from "react";
import { TimeSlot } from "../../lib/models";
import {
  IconCalculator,
  IconCalendar,
  IconClock,
  IconInfoCircle,
} from "@tabler/icons-react";
import { format } from "date-fns";
import SlotEditPopup from "./SlotEditPopup";
import { useAtom } from "jotai";
import eventManagerStore from "../../store/eventManagerStore";

import classes from "./SlotList.module.css";

const SlotListItem: FC<
  PropsWithChildren<{ icon: ReactElement; title: string }>
> = ({ icon, title, children }) => {
  return (
    <Box className={classes.container}>
      <Box
        style={{
          marginRight: "4px",
        }}
        className={classes.container}
      >
        {icon}
        <Text className={classes.slotItemText} fw={600} fz="sm">
          {title}
        </Text>
      </Box>
      <Text
        className={classes.colouredText}
        fz="sm"
        style={{
          whiteSpace: "nowrap",
        }}
        inline
      >
        {children}
      </Text>
    </Box>
  );
};

const SlotListCard: FC<{ slot: TimeSlot }> = ({ slot }) => {
  const [evManager, setEvManager] = useAtom(eventManagerStore);
  return (
    <Box
      onClick={() => setEvManager({ ...evManager, slotEditing: slot.id! })}
      className={classes.cardWrapper}
      style={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <SlotListItem
        icon={<IconCalendar className={classes.colouredText} size={18} />}
        title="Date"
      >
        {format(slot.startTime, "yyyy-M-dd")}
      </SlotListItem>
      <SlotListItem
        icon={<IconClock className={classes.colouredText} size={18} />}
        title="Start"
      >
        {format(slot.startTime, "hh:mm a")}
      </SlotListItem>
      <SlotListItem
        icon={<IconClock className={classes.colouredText} size={18} />}
        title="End"
      >
        {format(slot.endTime, "hh:mm a")}
      </SlotListItem>
    </Box>
  );
};

const SlotList: FC<{ slots: Array<TimeSlot> }> = ({ slots }) => {
  if (slots.length === 0) {
    return (
      <Alert variant="light" color="blue" title="Block out available slots">
        Select available slot on the calendar
      </Alert>
    );
  }

  return (
    <Box
      style={{
        overflowX: "scroll",
        minWidth: 0,
      }}
    >
      <Box
        style={{
          display: "inline-flex",
          gap: 8,
        }}
      >
        {slots.map((slot) => (
          <SlotListCard key={slot.id} slot={{ ...slot }} />
        ))}
      </Box>
    </Box>
  );
};

export default SlotList;
