import { Popover, Text } from "@mantine/core";
import { useAtom } from "jotai";

import { FC, PropsWithChildren, useEffect, useState } from "react";
import eventManagerStore from "../../store/eventManagerStore";
import { useClickOutside } from "@mantine/hooks";

const SlotEditPopup: FC<PropsWithChildren<{ slotId: string }>> = ({
  children,
  slotId,
}) => {
  const [eventManager] = useAtom(eventManagerStore);

  return (
    <Popover
      opened={eventManager.slotEditing === slotId}
      withinPortal
      transition="pop"
      position="right-start"
      shadow="md"
      width={400}
    >
      <Popover.Target>{children}</Popover.Target>
      <Popover.Dropdown>
        <Text size="sm">
          This is uncontrolled popover, it is opened when button is clicked
        </Text>
      </Popover.Dropdown>
    </Popover>
  );
};

export default SlotEditPopup;
