import { Box, createStyles, Grid, Text } from "@mantine/core";
import { FC } from "react";

const useStyles = createStyles((theme) => ({
  header: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
}));

const Cell = () => {
  return (
    <Box
      sx={(theme) => ({
        height: 80,
        border: `1px solid ${
          theme.colorScheme === "dark"
            ? theme.colors.dark[6]
            : theme.colors.gray[2]
        }`,
      })}
    ></Box>
  );
};

const CalendarRow: FC<{
  day: number;
  name: string;
}> = ({ day, name }) => {
  const { classes, cx } = useStyles();
  return (
    <Grid.Col
      sx={{
        padding: 0,
      }}
      span={1}
    >
      <Box onMouseDown={() => {}}>
        {Array(24)
          .fill(0)
          .map((_, i) => (
            <Cell />
          ))}
      </Box>
    </Grid.Col>
  );
};

export default CalendarRow;
