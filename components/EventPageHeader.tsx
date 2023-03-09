import {
  Box,
  createStyles,
  Group,
  Text,
  Button,
  UnstyledButton,
  Switch,
  Badge,
} from "@mantine/core";
import {
  IconCalendarEvent,
  IconDots,
  IconEdit,
  IconShare,
} from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { useAtom } from "jotai";
import Link from "next/link";
import { FC } from "react";
import { getEvent } from "../lib/endpoint";
import bookingDetailStore from "../store/bookingDetailStore";

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

const EventPageHeader: FC<{ eventId: string }> = ({ eventId }) => {
  const { data } = useQuery({
    queryFn: () => getEvent(eventId),
    queryKey: ["event", eventId],
  });
  const { classes } = useStyles();

  const [bookingDetail, setBookingDetail] = useAtom(bookingDetailStore);

  return (
    <Group className={classes.container} align="center" position="apart">
      <Group align="center">
        <Link href="/">
          <Box className={classes.iconContainer}>
            <IconCalendarEvent />
          </Box>
        </Link>

        <Text weight="bold">{data?.data?.name}</Text>
        <Badge color="gray">Read Only</Badge>

        <UnstyledButton className={classes.functionalButton}>
          <IconDots />
        </UnstyledButton>
      </Group>
      <Group spacing="sm">
        {!bookingDetail.isEditing &&
          bookingDetail.userRole !== "PARTICIPATOR" && (
            <Button
              onClick={() =>
                setBookingDetail({ ...bookingDetail, isEditing: true })
              }
              leftIcon={<IconEdit size={18} />}
              size="sm"
            >
              Edit
            </Button>
          )}

        <Button leftIcon={<IconShare size={18} />} size="sm">
          Share
        </Button>
      </Group>
    </Group>
  );
};

export default EventPageHeader;
