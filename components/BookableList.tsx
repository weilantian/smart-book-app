import useComputeBookableSharableLink from "@/hooks/useComputeShareableLink";
import { deleteBookable, getCurrentUserBookables } from "@/lib/endpoint";
import { Bookable } from "@/lib/models";
import { computeDurationText } from "@/lib/utils";
import { modals } from "@mantine/modals";
import {
  ActionIcon,
  Box,
  LoadingOverlay,
  CopyButton,
  Flex,
  Group,
  Menu,
  Stack,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { useHover } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import {
  IconCheck,
  IconClipboardCopy,
  IconEdit,
  IconLink,
  IconSettings,
  IconTrash,
} from "@tabler/icons-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { FC } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

const Item: FC<{ bookable: Bookable; onDelate: () => void }> = ({
  bookable,
  onDelate,
}) => {
  const theme = useMantineTheme();
  const { link } = useComputeBookableSharableLink(bookable.id ?? "");
  const { hovered, ref } = useHover();
  const queryClient = useQueryClient();
  const router = useRouter();
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
            <Text
              style={{
                color: "var(--mantine-color-gray-6)",
              }}
              size="sm"
            ></Text>
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
        <Menu width={160}>
          <Menu.Target>
            <ActionIcon variant="subtle" aria-label="Settings">
              <IconSettings
                style={{ width: "70%", height: "70%" }}
                stroke={1.5}
              />
            </ActionIcon>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Item
              onClick={() => router.push(`/bookable/edit/${bookable.id}`)}
              leftSection={<IconEdit size={14} />}
            >
              Edit
            </Menu.Item>

            <Menu.Item
              onClick={() => {
                modals.openConfirmModal({
                  title: "Delete Bookable",
                  children: (
                    <Text>
                      Are you sure you want to delete this booking link?
                    </Text>
                  ),
                  labels: {
                    confirm: "Delete",
                    cancel: "Cancel",
                  },
                  onConfirm: () => {
                    deleteBookable(bookable.id ?? "").then(() => {
                      onDelate();
                      notifications.show({
                        title: "Bookable deleted",
                        message: "The bookable has been deleted.",
                      });
                    });
                  },
                });
              }}
              color="red"
              leftSection={<IconTrash size={14} />}
            >
              Delete
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>
    </Group>
  );
};

const BookableList: FC = () => {
  const { data, refetch, isLoading } = useQuery({
    queryKey: ["bookables"],
    queryFn: getCurrentUserBookables,
  });
  return (
    <Stack
      style={{
        flex: 1,
      }}
      pos="relative"
    >
      <LoadingOverlay
        visible={isLoading}
        zIndex={1000}
        overlayProps={{ radius: "sm", blur: 2 }}
      />
      {data?.data.map((bookable) => (
        <Item onDelate={refetch} key={bookable.id} bookable={bookable} />
      ))}
    </Stack>
  );
};

export default BookableList;
