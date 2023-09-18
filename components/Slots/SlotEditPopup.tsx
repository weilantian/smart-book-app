import { Box, Popover, Text } from "@mantine/core";
import { useAtom } from "jotai";

import { FC, PropsWithChildren, useEffect, useState } from "react";
import eventManagerStore from "../../store/eventManagerStore";
import { useClickOutside } from "@mantine/hooks";

const SlotEditPopup: FC<PropsWithChildren<{ slotId: string }>> = ({
  children,
  slotId,
}) => {
  const [eventManager, setEvManager] = useAtom(eventManagerStore);
  const ref = useClickOutside(() =>
    setEvManager({ ...eventManager, slotEditing: null })
  );

  return (
    <Popover
      opened={eventManager.slotEditing === slotId}
      withinPortal
      transition="pop"
      position="right-start"
      shadow="md"
      width={400}
      onClose={() => setEvManager({ ...eventManager, slotEditing: null })}
    >
      <Popover.Target>{children}</Popover.Target>
      <Popover.Dropdown>
        <Box>
          <Text size="sm">
            This is uncontrolled popover, it is opened when button is clicked
          </Text>
        </Box>
      </Popover.Dropdown>
    </Popover>
  );
};

export default SlotEditPopup;
