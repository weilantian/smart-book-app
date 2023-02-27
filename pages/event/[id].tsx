import {
  Box,
  Container,
  createStyles,
  Grid,
  Group,
  Paper,
  Stack,
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

    overflow: "hidden",
  },
  inner: {
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.md,
    marginLeft: theme.spacing.lg,
    marginRight: theme.spacing.lg,
    display: "flex",
    boxSizing: "border-box",
    height: "100%",
    alignItems: "stretch",
  },
  paper: {
    boxSizing: "border-box",
    flexBasis: 0,
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.colors.white,
  },
  sideBar: {
    minWidth: 350,
  },
  main: {
    flexGrow: 1,
    width: "100%",
    overflowX: "scroll",
    overflowY: "hidden",
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

      <Group className={classes.inner}>
        <Paper className={cx(classes.paper, classes.sideBar)}>
          <Stack
            sx={{
              height: "100%",
            }}
            justify="space-between"
          >
            <Calendar
              onChange={setSelectedDate}
              value={selectedDate}
              size="md"
            />
            <Box
              sx={{
                paddingLeft: 10,
                paddingRight: 10,
                flexGrow: 1,
                overflowY: "scroll",
              }}
            >
              1
            </Box>
          </Stack>
        </Paper>
        <Paper className={cx(classes.paper, classes.main)}>
          <EventManager setDate={setSelectedDate} selectedDate={selectedDate} />
        </Paper>
      </Group>
    </div>
  );
};

export default EventPage;
