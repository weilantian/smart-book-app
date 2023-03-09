import { createStyles, Text } from "@mantine/core";
import { FC } from "react";

const useStyles = createStyles((theme) => ({
  text: {
    marginTop: 6,
    width: 36,
    height: 36,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: theme.fontSizes.lg,
    fontWeight: 400,
    borderRadius: theme.radius.xl,
  },
  selected: {
    color: "white",
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.colors.blue[8]
        : theme.colors.blue[6],
    fontWeight: 500,
  },
}));

const DayIndicator: FC<{ day: string; highlighted: boolean }> = ({
  day,
  highlighted,
}) => {
  const { classes, cx } = useStyles();
  return (
    <Text className={cx(classes.text, highlighted && classes.selected)}>
      {day}
    </Text>
  );
};

export default DayIndicator;
