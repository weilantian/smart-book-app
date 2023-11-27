import { AttendeeInfo } from "@/lib/models";
import { Box, TextInput, Button } from "@mantine/core";
import { useForm } from "@mantine/form";
import { FC } from "react";

import classes from "@/styles/BookPage.module.css";

const AttendeeFormBlock: FC<{
  onSubmit: (values: AttendeeInfo) => void;
}> = ({ onSubmit }) => {
  const form = useForm({
    initialValues: {
      attendeeFirstName: "",
      attendeeLastName: "",
      attendeeEmail: "",
    },
    validate: {
      attendeeEmail: (value) =>
        /^\S+@\S+$/.test(value) ? null : "Please enter a valid email",
      attendeeFirstName: (value) =>
        value.length ? null : "Please enter your first name",
      attendeeLastName: (value) =>
        value.length ? null : "Please enter your last name",
    },
  });

  return (
    <Box
      style={{
        paddingLeft: 16,
        paddingRight: 16,
        paddingTop: 16,
      }}
      className={classes.block}
    >
      <form onSubmit={form.onSubmit(onSubmit)}>
        <TextInput
          {...form.getInputProps("attendeeFirstName")}
          withAsterisk
          label="First Name"
          placeholder="John"
        />
        <TextInput
          {...form.getInputProps("attendeeLastName")}
          mt="md"
          withAsterisk
          label="Last Name"
          placeholder="Doe"
        />
        <TextInput
          {...form.getInputProps("attendeeEmail")}
          mt="md"
          withAsterisk
          label="Email"
          placeholder="your@email.com"
        />
        <Button mt="md" type="submit" color="blue">
          Confirm
        </Button>
      </form>
    </Box>
  );
};

export default AttendeeFormBlock;
