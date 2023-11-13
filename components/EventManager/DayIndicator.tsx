import { Text } from "@mantine/core";
import { FC } from "react";
import cx from "clsx";
import classes from "./DayIndicator.module.css";

const DayIndicator: FC<{ day: string; highlighted: boolean }> = ({
  day,
  highlighted,
}) => {
  return (
    <Text className={cx(classes.text, highlighted && classes.selected)}>
      {day}
    </Text>
  );
};

export default DayIndicator;
