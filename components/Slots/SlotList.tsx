import { Box, Group, createStyles, Text, Flex } from "@mantine/core";
import { FC, PropsWithChildren, ReactElement } from "react";
import { TimeSlot } from "../../lib/models";
import { IconCalculator, IconCalendar, IconClock } from "@tabler/icons-react";
import { format } from "date-fns";
import SlotEditPopup from "./SlotEditPopup";
import { useAtom } from "jotai";
import eventManagerStore from "../../store/eventManagerStore";

const useStyles = createStyles((theme) => ({
  cardWrapper: {
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.colors.blue[3]
        : theme.colors.blue[0],

    paddingTop: theme.spacing.xs,
    paddingBottom: theme.spacing.xs,
    paddingLeft: theme.spacing.sm,
    paddingRight: theme.spacing.sm,

    borderRadius: theme.radius.sm,
  },
  container: {
    display: "flex",
    width: "fit-content",
    alignItems: "center",
  },
  colouredText: {
    color: theme.colors.blue[9],
  },
}));

const SlotListItem: FC<
  PropsWithChildren<{ icon: ReactElement; title: string }>
> = ({ icon, title, children }) => {
  const { classes } = useStyles();

  return (
    <Box className={classes.container}>
      <Box
        sx={{
          marginRight: "4px",
        }}
        className={classes.container}
      >
        {icon}
        <Text
          sx={(theme) => ({
            marginLeft: "2px",
            color: theme.colors.blue[8],
          })}
          fw={600}
          fz="sm"
        >
          {title}
        </Text>
      </Box>
      <Text
        className={classes.colouredText}
        fz="sm"
        sx={{
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
  const { classes } = useStyles();
  const [evManager, setEvManager] = useAtom(eventManagerStore);
  return (
    <Box
      onClick={() => setEvManager({ ...evManager, slotEditing: slot.id! })}
      className={classes.cardWrapper}
      sx={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <SlotListItem
        icon={<IconCalendar className={classes.colouredText} size={18} />}
        title="Date"
      >
        {format(slot.startTime, "yyyy-mm-dd")}
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
  return (
    <Box
      sx={{
        overflowX: "scroll",
        minWidth: 0,
      }}
    >
      <Box
        sx={{
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
