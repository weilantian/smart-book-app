import { Box, Text } from "@mantine/core";
import { FC, useEffect, useState } from "react";
import { format } from "date-fns";
import { COL_HEIGHT } from "../config";

const CurrentTimeMarker: FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const top =
    (currentDate.getHours() + currentDate.getMinutes() / 60) * COL_HEIGHT;
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  return (
    <Box
      sx={{
        top,
        display: "flex",
        alignItems: "center",
        left: -53,
        position: "absolute",
        zIndex: 100,
        userSelect: "none",
        pointerEvents: "none",
      }}
    >
      <Text>{format(currentDate, "HH:mm")}</Text>
      <Box
        sx={{
          marginLeft: 7,
          width: "1200px",
          height: 1.5,
          backgroundColor: "red",
          userSelect: "none",
          pointerEvents: "none",
        }}
      ></Box>
    </Box>
  );
};

export default CurrentTimeMarker;
