import { NextPage } from "next";

import { createStyles, Paper, Title } from "@mantine/core";
import EventPageHeader from "../components/EventPageHeader";

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

const IndexPage: NextPage = () => {
  const { classes, cx } = useStyles();
  return (
    <div className={classes.container}>
      <EventPageHeader />
    </div>
  );
};

export default IndexPage;
