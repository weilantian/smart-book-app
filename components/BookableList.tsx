import useComputeBookableSharableLink from "@/hooks/useComputeShareableLink";
import { getCurrentUserBookables } from "@/lib/endpoint";
import { Bookable } from "@/lib/models";
import { computeDurationText } from "@/lib/utils";
import { IconSetting } from "@douyinfe/semi-icons";
import {
  ActionIcon,
  Box,
  Button,
  CopyButton,
  Flex,
  Group,
  Stack,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { useHover } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import {
  IconCheck,
  IconClipboardCopy,
  IconLink,
  IconSettings,
} from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { FC } from "react";

const Item: FC<{ bookable: Bookable }> = ({ bookable }) => {
  const theme = useMantineTheme();
  const { link } = useComputeBookableSharableLink(bookable.id ?? "");
  const { hovered, ref } = useHover();
  return (
    <Group ref={ref} wrap="nowrap" justify="space-between">
      <Flex>
        <IconLink color={theme.colors.gray[5]} size={18} />
        <Box ml={4}>
          <Text lineClamp={1} size="sm" fw={500}>
            {bookable.name ? bookable.name : "(Untitled Bookable)"}
          </Text>
          <Group>
            <Text
              style={{
                color: "var(--mantine-color-gray-6)",
              }}
              size="sm"
            >
              {computeDurationText(bookable.duration)}
            </Text>
          </Group>
        </Box>
      </Flex>

      <Group
        wrap="nowrap"
        style={{
          opacity: hovered ? 1 : 0,
        }}
        gap={4}
      >
        <CopyButton value={link}>
          {({ copied, copy }) => (
            <ActionIcon
              onClick={() => {
                copy();
                notifications.show({
                  title: "Booking link copied",
                  message:
                    "The booking link has been copied to your clipboard.",
                });
              }}
              variant="subtle"
              aria-label="Settings"
            >
              {copied ? (
                <IconCheck
                  style={{ width: "70%", height: "70%" }}
                  stroke={1.5}
                />
              ) : (
                <IconClipboardCopy
                  style={{ width: "70%", height: "70%" }}
                  stroke={1.5}
                />
              )}
            </ActionIcon>
          )}
        </CopyButton>

        <ActionIcon variant="subtle" aria-label="Settings">
          <IconSettings style={{ width: "70%", height: "70%" }} stroke={1.5} />
        </ActionIcon>
      </Group>
    </Group>
  );
};

const BookableList: FC = () => {
  const { data } = useQuery({
    queryKey: ["bookables"],
    queryFn: getCurrentUserBookables,
  });
  return (
    <Stack>
      {data?.data.map((bookable) => (
        <Item key={bookable.id} bookable={bookable} />
      ))}
    </Stack>
  );
};

export default BookableList;
