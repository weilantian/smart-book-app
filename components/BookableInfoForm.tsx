import {
  Box,
  Divider,
  Group,
  NumberInput,
  Select,
  Stack,
  TextInput,
  Textarea,
  Title,
} from "@mantine/core";
import { IconHeading, IconLocation } from "@tabler/icons-react";
import { FC } from "react";
import { Button } from "@mantine/core";
import { useForm } from "@mantine/form";
import { Bookable } from "@/lib/models";
import { calculateDuration } from "@/lib/utils";

interface BookableInfoFormValues {
  name: string;
  location: string;
  description: string;
  type: "ONE_TIME" | "RECURRING";
  hours: number;
  minutes: number;
}

const BookableInfoForm: FC<{
  onSubmit: (data: Partial<Bookable>) => void;
}> = ({ onSubmit }) => {
  const form = useForm<BookableInfoFormValues>({
    initialValues: {
      name: "",
      location: "",
      description: "",
      hours: 0,
      minutes: 30,
      type: "ONE_TIME",
    },
  });
  return (
    <form
      onSubmit={form.onSubmit((data) => {
        const { hours, minutes, ...dataToSubmit } = data;
        onSubmit({
          ...dataToSubmit,
          duration: calculateDuration({ hours, minutes }),
        });
      })}
    >
      <Stack spacing={8}>
        <TextInput
          icon={<IconHeading />}
          label="Name"
          placeholder="Daily Standup"
          {...form.getInputProps("name")}
        />
        <TextInput
          icon={<IconLocation />}
          label="Location"
          placeholder="Location"
          {...form.getInputProps("location")}
        />
        <Textarea
          placeholder="Description"
          minRows={4}
          label="Description"
          {...form.getInputProps("description")}
        />
        <Divider />
        <Title order={5}>Duration</Title>
        <Group grow>
          <NumberInput
            placeholder=""
            label="Hours"
            {...form.getInputProps("hours")}
          />
          <NumberInput
            placeholder=""
            label="Minutes"
            {...form.getInputProps("minutes")}
          />
        </Group>
        <Divider />
        <Select
          label="Type"
          placeholder="Please select..."
          data={[
            {
              value: "ONE_TIME",
              label: "One Time",
            },
            {
              value: "RECURRING",
              label: "Recurring",
            },
          ]}
          {...form.getInputProps("type")}
        />
        <Button
          sx={{
            marginTop: 8,
          }}
          type="submit"
        >
          Save & Copy Link
        </Button>
      </Stack>
    </form>
  );
};
export default BookableInfoForm;