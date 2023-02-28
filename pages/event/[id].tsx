import {
  Box,
  Button,
  Container,
  createStyles,
  Divider,
  Grid,
  Group,
  Paper,
  Stack,
  Title,
} from "@mantine/core";
import { useRouter } from "next/router";
import { FC, useState } from "react";
import EventPageHeader from "../../components/EventPageHeader";
import { Calendar } from "@mantine/dates";
import EventManager from "../../components/EventManager";

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

    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.colors.white,
  },
  sideBar: {
    gap: 18,
    display: "flex",
    flexDirection: "column",
    width: 350,
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
  //TODO: Manege if the user is editing or not
  const [editing, setEditing] = useState(false);
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const { classes, cx } = useStyles();
  return (
    <div className={classes.container}>
      <EventPageHeader />

      <div className={classes.inner}>
        <Paper className={cx(classes.paper, classes.sideBar)}>
          <Calendar onChange={setSelectedDate} value={selectedDate} size="md" />
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
              <Button size="xs" variant="light">
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
              <Stack style={{ height: 100 }}></Stack>
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
