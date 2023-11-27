import { Box, Indicator } from "@mantine/core";
import { DateValue, DatePicker } from "@mantine/dates";
import { FC } from "react";

import classes from "@/styles/BookPage.module.css";

const CalendarBlock: FC<{
  availableDates: Date[];
  date?: Date | null;
  setDate: (date: DateValue) => void;
}> = ({ date, setDate, availableDates }) => {
  return (
    <Box
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
      className={classes.block}
    >
      <DatePicker
        renderDay={(date) => {
          const day = date.getDate();
          const isAvailable =
            availableDates?.find((d) => d.getDate() === date.getDate()) !==
            undefined;
          return isAvailable ? (
            <Indicator size={6} color="green" offset={-4}>
              {day}
            </Indicator>
          ) : (
            day
          );
        }}
        size="md"
        onChange={setDate}
        value={date}
      />
    </Box>
  );
};

export default CalendarBlock;
