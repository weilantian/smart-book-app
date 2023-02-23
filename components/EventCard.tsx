import {
  Card,
  Image,
  createStyles,
  Group,
  Text,
  Badge,
  Button,
  Center,
} from "@mantine/core";
import { IconUser, IconCalendar, IconDots } from "@tabler/icons-react";
import { FC } from "react";
import { EventStatus } from "../lib/models";
import { computeStatusName } from "../lib/utils";

const useStyles = createStyles((theme) => ({
  icon: {
    marginRight: 5,
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[2]
        : theme.colors.gray[5],
  },
  detailContainer: {
    paddingTop: 10,
    paddingBottom: 20,
    borderBottom: `1px solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[3]
    }`,
  },
}));

const EventCard: FC<{
  name: string;
  status: EventStatus;
  participators: number;
  slots: number;
}> = ({ name, participators, slots, status }) => {
  const { classes } = useStyles();
  return (
    <Card p="lg" radius="md" withBorder>
      <Card.Section
        sx={{
          position: "relative",
        }}
      >
        <Image
          src="https://images.unsplash.com/photo-1527004013197-933c4bb611b3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=720&q=80"
          height={120}
          alt="Norway"
        />
      </Card.Section>
      <Group position="apart" mt="md" mb="xs">
        <Text weight={500}>{name}</Text>
        <Badge color="blue" variant="light">
          {computeStatusName(status)}
        </Badge>
      </Group>
      <Group className={classes.detailContainer} spacing={8} mb={-8}>
        <Center>
          <IconUser className={classes.icon} size={18} stroke={1.5} />
          <Text size="sm">5 participators</Text>
        </Center>
        <Center>
          <IconCalendar className={classes.icon} size={18} stroke={1.5} />
          <Text size="sm">3 slots</Text>
        </Center>
      </Group>
      <Group mt="xl" position="apart" align="end">
        <div></div>
        <Group spacing="sm">
          <Button>Manage</Button>
          <Button p="sm" variant="default">
            <IconDots size="18" />
          </Button>
        </Group>
      </Group>
    </Card>
  );
};

export default EventCard;
