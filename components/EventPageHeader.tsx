import useCurrentUser from "@/hooks/useCurrentUser";
import {
  Box,
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
  IconMoonStars,
  IconSun,
} from "@tabler/icons-react";

import classes from "./EventPageHedaer.module.css";

import Link from "next/link";
import { FC, useEffect, useState } from "react";
import { useRouter } from "next/router";

const UserWidget: FC = () => {
  const router = useRouter();
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
        <Menu.Item
          onClick={() => {
            window.localStorage.removeItem("smart_book_token");
            router.push("/signin");
          }}
        >
          Logout
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

const EventPageHeader: FC<{
  title?: string;
  home?: boolean;
  widgets?: React.ReactNode;
}> = ({ home, title, widgets }) => {
  return (
    <Group className={classes.container} align="center" justify="space-between">
      <Group align="center">
        <Link href="/">
          <Box className={classes.iconContainer}>
            <IconCalendarEvent />
          </Box>
        </Link>

        {home && <Text fw={700}>Smart Booking</Text>}

        {!home && title && <Text fw={700}>{title}</Text>}

        <UnstyledButton className={classes.functionalButton}>
          <IconDots />
        </UnstyledButton>
      </Group>
      <Group gap="sm">
        <UserWidget />
        <LightDarkModeSwitcher />
        {widgets}
      </Group>
    </Group>
  );
};

const LightDarkModeSwitcher = () => {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  const [isDark, setIsDark] = useState(false);

  useEffect(() => setIsDark(colorScheme === "dark"), [colorScheme]);

  return (
    <ActionIcon
      variant="outline"
      color="blue"
      onClick={() => toggleColorScheme()}
      title="Toggle color scheme"
    >
      {isDark ? <IconSun size="1.1rem" /> : <IconMoonStars size="1.1rem" />}
    </ActionIcon>
  );
};

export default EventPageHeader;
