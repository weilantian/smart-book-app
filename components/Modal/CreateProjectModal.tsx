import { Modal, Stack, TextInput, Group, Button, Switch } from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { ComponentProps, FC } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createEvent } from "../../lib/endpoint";
import { useState } from "react";

const CreateEventModal: FC<ComponentProps<typeof Modal>> = ({
  opened,
  onClose,
}) => {
  const { mutate, isLoading } = useMutation({
    mutationFn: createEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-managed-events"] });
      onClose();
    },
  });
  const queryClient = useQueryClient();
  const [eventName, setEventName] = useState("");

  return (
    <Modal onClose={onClose} opened={opened} title={"Create New Event"}>
      <Stack>
        <TextInput
          value={eventName}
          onChange={(e) => setEventName(e.currentTarget.value)}
          required
          label="Event Name"
          placeholder="Event Name"
        />

        <Group justify="space-between">
          <span />
          <Button onClick={() => mutate(eventName)} loading={isLoading}>
            Create
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};

export default CreateEventModal;
