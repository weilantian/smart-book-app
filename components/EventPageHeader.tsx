import useCurrentUser from "@/hooks/useCurrentUser";
import {
  Box,
  createStyles,
  Group,
  Text,
  Button,
  UnstyledButton,
  Avatar,
  Menu,
  useMantineColorScheme,
  ActionIcon,
} from "@mantine/core";
import {
  IconCalendarEvent,
  IconDots,
  IconEdit,
  IconMoonStars,
  IconSettings,
  IconShare,
  IconSun,
} from "@tabler/icons-react";

import Link from "next/link";
import { FC } from "react";

const useStyles = createStyles((theme) => ({
  container: {
    paddingTop: theme.spacing.sm,
    paddingRight: theme.spacing.md,
    paddingLeft: theme.spacing.md,
  },
  iconContainer: {
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.colors.blue[5]
        : theme.colors.blue[2],
    padding: theme.spacing.xs,
    width: 44,
    height: 44,
    display: "flex",
    alignItems: "center",
    transition: "background-color 200ms ease",
    borderRadius: theme.radius.md,
    color:
      theme.colorScheme === "dark"
        ? theme.colors.blue[2]
        : theme.colors.blue[9],
    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.blue[8]
          : theme.colors.blue[3],
    },
  },
  functionalButton: {
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.colors.dark[4]
        : theme.colors.gray[2],
    padding: theme.spacing.xs,
    width: 38,
    height: 38,
    display: "flex",
    alignItems: "center",
    transition: "background-color 200ms ease",
    borderRadius: theme.radius.xl,
    color:
      theme.colorScheme === "dark" ? theme.colors.white : theme.colors.gray[9],
    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[3]
          : theme.colors.gray[3],
    },
  },
}));

const UserWidget: FC = () => {
  const { data } = useCurrentUser();
  return (
    <Menu shadow="md" width={200}>
      <Menu.Target>
        <Button variant="subtle">
          <Avatar />
          <Text>{data?.data.name}</Text>
        </Button>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Label>Application</Menu.Label>
        <Menu.Item>Settings</Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

const EventPageHeader: FC<{
  title?: string;
  home?: boolean;
  widgets?: React.ReactNode;
}> = ({ home, title, widgets }) => {
  const { classes } = useStyles();

  return (
    <Group className={classes.container} align="center" position="apart">
      <Group align="center">
        <Link href="/">
          <Box className={classes.iconContainer}>
            <IconCalendarEvent />
          </Box>
        </Link>

        {home && <Text weight="bold">Smart Booking</Text>}

        {!home && title && <Text weight="bold">{title}</Text>}

        <UnstyledButton className={classes.functionalButton}>
          <IconDots />
        </UnstyledButton>
      </Group>
      <Group spacing="sm">
        <UserWidget />
        <LightDarkModeSwitcher />
        {widgets}
      </Group>
    </Group>
  );
};

const LightDarkModeSwitcher = () => {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";

  return (
    <ActionIcon
      variant="outline"
      color="blue"
      onClick={() => toggleColorScheme()}
      title="Toggle color scheme"
    >
      {dark ? <IconSun size="1.1rem" /> : <IconMoonStars size="1.1rem" />}
    </ActionIcon>
  );
};

export default EventPageHeader;
