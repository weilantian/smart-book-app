import {
  Box,
  Group,
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

const BookableInfoForm: FC<{
  onSubmit: (data: Partial<Bookable>) => void;
}> = ({ onSubmit }) => {
  const form = useForm<Partial<Bookable>>({
    initialValues: {
      name: "",
      location: "",
      description: "",
      type: "ONE_TIME",
    },
  });
  return (
    <form onSubmit={form.onSubmit(onSubmit)}>
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
