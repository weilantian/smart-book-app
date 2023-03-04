import {
  Modal,
  Stack,
  NumberInput,
  Divider,
  Group,
  Checkbox,
  Button,
} from "@mantine/core";
import { DatePicker } from "@douyinfe/semi-ui";
import { useForm } from "@mantine/form";
import { ComponentProps, FC, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createSlot } from "../../lib/endpoint";

const CreateSlotModal: FC<
  ComponentProps<typeof Modal> & {
    eventId: string;
  }
> = ({ opened, onClose, eventId }) => {
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation({
    mutationFn: createSlot,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["slots"] });
      onClose();
    },
  });
  const [unlimitedParticipators, setUnlimitedParticipators] = useState(false);
  const form = useForm({
    initialValues: {
      participators: unlimitedParticipators ? 0 : 100,
      duration: [new Date(), new Date()],
      booking: true,
    },
    validate: {
      participators: (value) => value < 0 && "Participators must be positive",
    },
  });
  return (
    <Modal title="Create Slot" opened={opened} onClose={onClose}>
      <form
        onSubmit={form.onSubmit((input) => {
          mutate({
            booking: input.booking,
            eventId,
            startDate: input.duration[0],
            endDate: input.duration[1],
            availableParticipatorNum: unlimitedParticipators
              ? 0
              : input.participators,
          });
        })}
      >
        <Stack>
          <NumberInput
            onChange={(value) => form.setFieldValue("participators", value!)}
            disabled={unlimitedParticipators}
            defaultValue={100}
            label="Participators"
            value={form.values.participators}
            error={form.errors.participators}
          />
          <Checkbox
            checked={unlimitedParticipators}
            onChange={(e) => setUnlimitedParticipators(e.target.checked)}
            label="Unlimited Participators"
          />
          <Divider />
          <DatePicker
            autoSwitchDate
            format="yyyy-MM-dd HH:mm"
            timePickerOpts={{
              format: "HH:mm",
            }}
            syncSwitchMonth={true}
            onChange={(date) =>
              form.setFieldValue("duration", date as Array<Date>)
            }
            value={form.values.duration}
            type="dateTimeRange"
          />
          <Divider />

          <Group position="right">
            <Button onClick={onClose} variant="outline">
              Cancel
            </Button>
            <Button type="submit" loading={isLoading}>
              Create
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
};

export default CreateSlotModal;
