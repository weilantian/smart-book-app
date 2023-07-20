import { Tag } from "@douyinfe/semi-ui";
import {
  Stack,
  LoadingOverlay,
  Box,
  Text,
  Group,
  Button,
  createStyles,
  Avatar,
  Badge,
} from "@mantine/core";
import { IconClock } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useAtom } from "jotai";
import Link from "next/link";
import { useRouter } from "next/router";
import { FC } from "react";

import { getSlotsOfEvent } from "../../lib/endpoint";
import { Slot, SlotStatus } from "../../lib/models";
import { computeSlotStatusName } from "../../lib/utils";
import bookingDetailStore from "../../store/bookingDetailStore";

const useStyles = createStyles((theme) => ({
  container: {
    borderRadius: theme.radius.sm,
    paddingLeft: theme.spacing.md,
    paddingRight: theme.spacing.md,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.md,
    border: `1px solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[2]
    }`,
    transition: "background 200ms ease",
    cursor: "pointer",
    background: theme.colorScheme === "dark" ? theme.colors.dark[7] : "#fff",
    "&:hover": {
      background: theme.colorScheme === "dark" ? theme.colors.dark[6] : "#fff",
    },
  },
}));

const Item: FC<{ slot: Slot }> = ({ slot }) => {
  const { classes } = useStyles();
  const startDate = dayjs(slot.startDate);
  const endDate = dayjs(slot.endDate);
  const router = useRouter();
  const [bookingDetail] = useAtom(bookingDetailStore);
  return (
    <Box
      onClick={() => {
        router.push(`/event/slot/${slot.id}`);
      }}
      className={classes.container}
    >
      <Stack spacing={12}>
        <Group position="apart" spacing={8}>
          <Text
            sx={(theme) => ({
              fontSize: 14,
              color:
                theme.colorScheme === "dark"
                  ? theme.colors.dark[3]
                  : theme.colors.gray[6],
            })}
          >
            Start
          </Text>
          <Text weight="600" size="sm">
            {dayjs(slot.startDate).format("L LT")}
          </Text>
        </Group>
        <Group position="apart" spacing={8}>
          <Text
            sx={(theme) => ({
              fontSize: 14,
              color:
                theme.colorScheme === "dark"
                  ? theme.colors.dark[3]
                  : theme.colors.gray[6],
            })}
          >
            End
          </Text>
          <Text weight="600" size="sm">
            {dayjs(slot.endDate).format("L LT")}
          </Text>
        </Group>
        <Group position="apart" spacing={8}>
          <Text
            sx={(theme) => ({
              fontSize: 14,
              color:
                theme.colorScheme === "dark"
                  ? theme.colors.dark[3]
                  : theme.colors.gray[6],
            })}
          >
            Duration
          </Text>
          <Text weight="600" size="sm">
            {endDate.diff(startDate, "minutes")} minutes
          </Text>
        </Group>
        <Group position="apart" spacing={8}>
          <Text
            sx={(theme) => ({
              fontSize: 14,
              color:
                theme.colorScheme === "dark"
                  ? theme.colors.dark[3]
                  : theme.colors.gray[6],
            })}
          >
            Host By
          </Text>
          <Group spacing={4}>
            <Avatar src={slot.host?.profileImgUrl} size="sm" />
            <Text size="sm">{slot.host?.name}</Text>
          </Group>
        </Group>
        <Group position="apart" spacing={8}>
          <Text
            sx={(theme) => ({
              fontSize: 14,
              color:
                theme.colorScheme === "dark"
                  ? theme.colors.dark[3]
                  : theme.colors.gray[6],
            })}
          >
            Capacity
          </Text>
          <Group spacing={4}>
            <Text size="sm">
              Booked {slot.participatorNum} / Max{" "}
              {slot.availableParticipatorNum}
            </Text>
          </Group>
        </Group>
        <Group mt={12} position="apart">
          <Badge color={slot.status == SlotStatus.AVAILABLE ? "green" : "red"}>
            {computeSlotStatusName(slot.status)}
          </Badge>

          {bookingDetail.userRole == "PARTICIPATOR" && (
            <Button
              onClick={(e) => {
                e.stopPropagation();
              }}
              size="xs"
            >
              Book
            </Button>
          )}

          {bookingDetail.userRole !== "PARTICIPATOR" &&
            bookingDetail.isEditing && (
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                }}
                size="xs"
              >
                Edit
              </Button>
            )}
        </Group>
      </Stack>
    </Box>
  );
};

const SlotList: FC<{ eventId: string }> = ({ eventId }) => {
  const { data, isLoading } = useQuery({
    queryKey: ["slots", { eventId }],
    queryFn: () => getSlotsOfEvent(eventId),
  });
  return (
    <Stack pos="relative" style={{ height: 200 }}>
      <LoadingOverlay visible={isLoading} overlayBlur={2} />
      {data?.data.map((slot) => (
        <Item key={slot.id} slot={slot} />
      ))}
    </Stack>
  );
};

export default SlotList;
