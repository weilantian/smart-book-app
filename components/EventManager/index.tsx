import {
  Box,
  Button,
  createStyles,
  Flex,
  Grid,
  Group,
  Stack,
  Text,
} from "@mantine/core";
import CalenderRow from "./CalenderRow";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { FC, useState } from "react";

const useStyles = createStyles((theme) => ({
  container: {
    width: "100%",

    paddingTop: theme.spacing.md,
    height: 800,
  },
  cellHeader: {
    top: 120,
    width: "100%",
  },
  cellHeaderItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
}));

const EventManager: FC<{
  selectedDate: Date | null;
  setDate: (date: Date | null) => void;
}> = ({ selectedDate, setDate }) => {
  const { classes, cx } = useStyles();

  //Get each day of the week of the selected date
  const currentWeek = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(selectedDate ?? new Date());
    date.setDate(date.getDate() - date.getDay() + i);
    return date;
  });

  return (
    <Box>
      <Group position="right">
        <Button
          onClick={() =>
            setDate(
              new Date(
                selectedDate?.setDate(selectedDate.getDate() - 7) ?? new Date()
              )
            )
          }
        >
          <IconChevronLeft />
        </Button>
        <Button onClick={() => setDate(new Date())}>Today</Button>
        <Button
          onClick={() =>
            setDate(
              new Date(
                selectedDate?.setDate(selectedDate.getDate() + 7) ?? new Date()
              )
            )
          }
        >
          <IconChevronRight />
        </Button>
      </Group>
      <Flex className={classes.container}>
        <Stack
          sx={{
            flexGrow: 1,
          }}
        >
          <Box
            sx={{
              marginLeft: 60,
            }}
          >
            <Grid className={classes.cellHeader} columns={7}>
              {currentWeek.map((date) => (
                <Grid.Col span={1}>
                  <Box className={classes.cellHeaderItem}>
                    <Text color="gray">
                      {date.toLocaleString("en-US", { weekday: "short" })}
                    </Text>
                    <Text size={24}>
                      {date.toLocaleString("en-US", { day: "numeric" })}
                    </Text>
                  </Box>
                </Grid.Col>
              ))}
            </Grid>
          </Box>
          <Flex
            sx={{
              flexGrow: 1,
              overflowY: "scroll",
              overflowX: "hidden",
            }}
          >
            <Stack
              spacing={80}
              sx={{
                paddingRight: 10,
                marginTop: 70,
              }}
            >
              {Array(24)
                .fill(0)
                .map((_, i) => (
                  <Text
                    sx={{
                      lineHeight: 0,
                    }}
                    color="gray"
                    align="end"
                  >
                    {i}:00
                  </Text>
                ))}
            </Stack>
            <Box
              sx={{
                flexGrow: 1,
                paddingBottom: 100,
              }}
            >
              <Grid columns={7}>
                <CalenderRow day={1} name="Monday" />
                <CalenderRow day={1} name="Monday" />
                <CalenderRow day={1} name="Monday" />
                <CalenderRow day={1} name="Monday" />
                <CalenderRow day={1} name="Monday" />
                <CalenderRow day={1} name="Monday" />
                <CalenderRow day={1} name="Monday" />
              </Grid>
            </Box>
          </Flex>
        </Stack>
      </Flex>
    </Box>
  );
};

export default EventManager;
