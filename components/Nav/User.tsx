import {
  Avatar,
  Box,
  Group,
  UnstyledButton,
  useMantineTheme,
  Text,
  Menu,
  useMantineColorScheme,
} from "@mantine/core";
import { FC } from "react";
import { IconSettings, IconPower } from "@tabler/icons-react";
import { useRouter } from "next/router";

const User: FC<{ name: string; email: string }> = ({ name, email }) => {
  const theme = useMantineTheme();
  const router = useRouter();
  const { colorScheme } = useMantineColorScheme();
  return (
    <Box
      style={{
        paddingTop: theme.spacing.sm,
        borderTop: `1px solid ${
          colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[2]
        }`,
      }}
    >
      <Menu
        withArrow
        position="top-start"
        transitionProps={{
          transition: "pop",
        }}
      >
        <Menu.Target>
          <UnstyledButton
            style={{
              display: "block",
              width: "100%",
              padding: theme.spacing.xs,
              borderRadius: theme.radius.sm,
              color:
                colorScheme === "dark" ? theme.colors.dark[0] : theme.black,
              "&:hover": {
                backgroundColor:
                  colorScheme === "dark"
                    ? theme.colors.dark[6]
                    : theme.colors.gray[0],
              },
            }}
          >
            <Group>
              <Avatar radius="xl" />
              <Box style={{ flex: 1 }}>
                <Text size="sm">{name}</Text>
                <Text color="dimmed" size="xs">
                  {email}
                </Text>
              </Box>
            </Group>
          </UnstyledButton>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item leftSection={<IconSettings size={14} />}>
            Settings
          </Menu.Item>
          <Menu.Item
            onClick={() => {
              localStorage.removeItem("smart_book_token");
              router.push("/signin");
            }}
            leftSection={<IconPower size={14} />}
          >
            Logout
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </Box>
  );
};

export default User;
