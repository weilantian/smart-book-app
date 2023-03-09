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
        height: 60,
        borderLeft: `1px solid ${
          theme.colorScheme === "dark"
            ? theme.colors.dark[4]
            : theme.colors.gray[2]
        }`,
        borderRight: `1px solid ${
          theme.colorScheme === "dark"
            ? theme.colors.dark[4]
            : theme.colors.gray[2]
        }`,
        borderBottom: `1px solid ${
          theme.colorScheme === "dark"
            ? theme.colors.dark[5]
            : theme.colors.gray[1]
        }`,
        borderTop: `1px solid ${
          theme.colorScheme === "dark"
            ? theme.colors.dark[5]
            : theme.colors.gray[1]
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
        {Array(23)
          .fill(0)
          .map((_, i) => (
            <Cell key={i} />
          ))}
      </Box>
    </Grid.Col>
  );
};

export default CalendarRow;
