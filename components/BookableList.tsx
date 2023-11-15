import useComputeBookableSharableLink from "@/hooks/useComputeShareableLink";
import { getCurrentUserBookables } from "@/lib/endpoint";
import { Bookable } from "@/lib/models";
import { computeDurationText } from "@/lib/utils";
import { Box, Flex, Group, Stack, Text, useMantineTheme } from "@mantine/core";
import { IconLink } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { FC } from "react";

const Item: FC<{ bookable: Bookable }> = ({ bookable }) => {
  const theme = useMantineTheme();
  const { link } = useComputeBookableSharableLink(bookable.id ?? "");
  return (
    <Flex>
      <IconLink color={theme.colors.gray[5]} size={18} />
      <Box ml={4}>
        <Text size="sm" fw={500}>
          {bookable.name}
        </Text>
        <Group>
          <Text
            style={{
              color: "var(--mantine-color-gray-6)",
            }}
            size="sm"
          >
            {computeDurationText(bookable.duration)}
          </Text>
        </Group>
      </Box>
    </Flex>
  );
};

const BookableList: FC = () => {
  const { data } = useQuery({
    queryKey: ["bookables"],
    queryFn: getCurrentUserBookables,
  });
  return (
    <Stack>
      {data?.data.map((bookable) => (
        <Item key={bookable.id} bookable={bookable} />
      ))}
    </Stack>
  );
};

export default BookableList;
