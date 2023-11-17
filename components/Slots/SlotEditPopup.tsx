import {
  Badge,
  Box,
  Divider,
  Group,
  Popover,
  Text,
  Title,
} from "@mantine/core";
import { useAtom } from "jotai";

import { FC, PropsWithChildren, useEffect, useState } from "react";
import eventManagerStore from "../../store/eventManagerStore";
import { useClickOutside } from "@mantine/hooks";
import { TimeSlot } from "@/lib/models";
import { IconClick, IconClock, IconMan, IconUser } from "@tabler/icons-react";

const SlotEditPopup: FC<PropsWithChildren<{ slot: TimeSlot }>> = ({
  children,
  slot,
}) => {
  const [eventManager, setEvManager] = useAtom(eventManagerStore);
  const ref = useClickOutside(() =>
    setEvManager({ ...eventManager, slotEditing: null })
  );

  return (
    <Popover
      opened={eventManager.slotEditing === slot.id}
      withinPortal
      transitionProps={{
        transition: "pop",
      }}
      position="right-start"
      shadow="md"
      width={400}
      onClose={() => setEvManager({ ...eventManager, slotEditing: null })}
    >
      <Popover.Target>{children}</Popover.Target>
      <Popover.Dropdown>
        <Box>
          <Title order={4}>{slot.name}</Title>
          <Badge variant="light" mt={4} size="lg">
            <Group gap={4}>
              <IconClock size={12} />
              {slot.startTime.toLocaleDateString("en-AU", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}{" "}
              {slot.startTime.toLocaleTimeString()} -{" "}
              {slot.endTime.toLocaleTimeString()}
            </Group>
          </Badge>

          <Divider
            style={{
              marginTop: 12,
              marginBottom: 12,
            }}
          />

          {slot.slotDetail &&
            slot.slotDetail.map((item) => (
              <Group
                key={item.title}
                mt={4}
                style={{ color: "var(--mantine-color-gray-5" }}
                gap={5}
              >
                {item.icon} <Text>{item.value}</Text>
              </Group>
            ))}
        </Box>
      </Popover.Dropdown>
    </Popover>
  );
};

export default SlotEditPopup;
