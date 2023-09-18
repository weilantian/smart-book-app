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

const BookableInfoForm: FC<{
  onSubmit: (data: { title: string; location: string }) => void;
}> = ({ onSubmit }) => {
  const form = useForm({
    initialValues: {
      title: "",
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
          label="Title"
          placeholder="Daily Standup"
        />
        <TextInput
          icon={<IconLocation />}
          label="Location"
          placeholder="Location"
        />
        <Textarea placeholder="Description" minRows={4} label="Description" />
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
