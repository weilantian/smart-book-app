import {
  Box,
  createStyles,
  Group,
  Text,
  Button,
  UnstyledButton,
} from "@mantine/core";
import {
  IconCalendarEvent,
  IconDots,
  IconEdit,
  IconShare,
} from "@tabler/icons-react";

import Link from "next/link";
import { FC } from "react";

const useStyles = createStyles((theme) => ({
  container: {
    paddingTop: theme.spacing.sm,
    paddingRight: theme.spacing.md,
    paddingLeft: theme.spacing.md,
  },
  iconContainer: {
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.colors.blue[5]
        : theme.colors.blue[2],
    padding: theme.spacing.xs,
    width: 44,
    height: 44,
    display: "flex",
    alignItems: "center",
    transition: "background-color 200ms ease",
    borderRadius: theme.radius.md,
    color:
      theme.colorScheme === "dark"
        ? theme.colors.blue[2]
        : theme.colors.blue[9],
    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.blue[8]
          : theme.colors.blue[3],
    },
  },
  functionalButton: {
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.colors.dark[4]
        : theme.colors.gray[2],
    padding: theme.spacing.xs,
    width: 38,
    height: 38,
    display: "flex",
    alignItems: "center",
    transition: "background-color 200ms ease",
    borderRadius: theme.radius.xl,
    color:
      theme.colorScheme === "dark" ? theme.colors.white : theme.colors.gray[9],
    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[3]
          : theme.colors.gray[3],
    },
  },
}));

const EventPageHeader: FC = () => {
  const { classes } = useStyles();

  return (
    <Group className={classes.container} align="center" position="apart">
      <Group align="center">
        <Link href="/">
          <Box className={classes.iconContainer}>
            <IconCalendarEvent />
          </Box>
        </Link>

        <Text weight="bold">Smart Booking</Text>

        <UnstyledButton className={classes.functionalButton}>
          <IconDots />
        </UnstyledButton>
      </Group>
      <Group spacing="sm">
        <Button leftIcon={<IconShare size={18} />} size="sm">
          Share
        </Button>
      </Group>
    </Group>
  );
};

export default EventPageHeader;
