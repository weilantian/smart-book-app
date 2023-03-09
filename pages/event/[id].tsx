import {
  Box,
  Button,
  Checkbox,
  Container,
  createStyles,
  Divider,
  Grid,
  Group,
  LoadingOverlay,
  Modal,
  NumberInput,
  Paper,
  Stack,
  Switch,
  Title,
} from "@mantine/core";
import { useRouter } from "next/router";
import { ComponentProps, FC, useEffect, useState } from "react";
import EventPageHeader from "../../components/EventPageHeader";
import { Calendar, TimeInput } from "@mantine/dates";
import EventManager from "../../components/EventManager";
import { useForm } from "@mantine/form";

import { DatePicker } from "@douyinfe/semi-ui";
import CreateSlotModal from "../../components/Modal/CreateSlotModal";
import { useQuery } from "@tanstack/react-query";
import { getEvent, getSlotsOfEvent } from "../../lib/endpoint";
import SlotList from "../../components/Slots/SlotList";

const useStyles = createStyles((theme) => ({
  container: {
    display: "flex",
    flexDirection: "column",

    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.colors.dark[7]
        : theme.colors.gray[0],
    width: "100%",
    height: "100vh",
    boxSizing: "border-box",
  },
  inner: {
    flex: 1,
    gap: 14,
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing.md,
    paddingLeft: theme.spacing.lg,
    paddingRight: theme.spacing.lg,
    display: "flex",
    boxSizing: "border-box",

    alignItems: "stretch",
  },
  paper: {
    boxSizing: "border-box",
    border: `1px solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[2]
    }`,
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.colors.white,
  },
  sideBar: {
    gap: 0,
    display: "flex",
    flexDirection: "column",
    width: 310,
    boxSizing: "border-box",
  },
  main: {
    flex: 1,
    width: "100%",
    display: "flex",
    flexDirection: "column",
    boxSizing: "border-box",
  },
}));

const EventPage: FC = () => {
  const [creatingSlot, setCreatingSlot] = useState(false);
  //TODO: Manege if the user is editing or not
  const [editing, setEditing] = useState(false);
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const { classes, cx } = useStyles();
  const eventId = router.query.id as string;

  return (
    <div className={classes.container}>
      <CreateSlotModal
        eventId={eventId}
        onClose={() => setCreatingSlot(false)}
        opened={creatingSlot}
      />
      <EventPageHeader eventId={eventId} />

      <div className={classes.inner}>
        <Paper className={cx(classes.paper, classes.sideBar)}>
          <Calendar onChange={setSelectedDate} value={selectedDate} size="sm" />
          <Box
            sx={{
              flex: 1,
              flexDirection: "column",
              display: "flex",
            }}
          >
            <Divider my="sm" />
            <Group
              sx={{
                marginBottom: 12,
              }}
              position="apart"
            >
              <Title order={4}>Slots</Title>
              <Button
                onClick={() => setCreatingSlot(true)}
                size="xs"
                variant="light"
              >
                Add
              </Button>
            </Group>
            <Box
              sx={{
                flex: 1,

                overflowY: "scroll",
                minHeight: 0,
              }}
            >
              <SlotList eventId={eventId} />
            </Box>
          </Box>
        </Paper>
        <Paper className={cx(classes.paper, classes.main)}>
          <EventManager setDate={setSelectedDate} selectedDate={selectedDate} />
        </Paper>
      </div>
    </div>
  );
};

export default EventPage;
