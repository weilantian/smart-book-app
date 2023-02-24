import { Modal, Stack, TextInput, Group, Button } from "@mantine/core";
import { ComponentProps, FC } from "react";

const CreateEventModal: FC<ComponentProps<typeof Modal>> = ({
  opened,
  onClose,
}) => {
  return (
    <Modal onClose={onClose} opened={opened} title={"Create New Event"}>
      <Stack>
        <TextInput label="Event Name" placeholder="Event Name" />
        <Group position="apart">
          <span />
          <Button>Create</Button>
        </Group>
      </Stack>
    </Modal>
  );
};

export default CreateEventModal;
