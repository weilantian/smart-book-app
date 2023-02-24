import {
  Avatar,
  Box,
  Group,
  UnstyledButton,
  useMantineTheme,
  Text,
  Menu,
} from "@mantine/core";
import { FC } from "react";
import { IconSettings, IconPower } from "@tabler/icons-react";
import { useRouter } from "next/router";

const User: FC<{ name: string; email: string }> = ({ name, email }) => {
  const theme = useMantineTheme();
  const router = useRouter();
  return (
    <Box
      sx={{
        paddingTop: theme.spacing.sm,
        borderTop: `1px solid ${
          theme.colorScheme === "dark"
            ? theme.colors.dark[4]
            : theme.colors.gray[2]
        }`,
      }}
    >
      <Menu withArrow position="top-start" transition="pop">
        <Menu.Target>
          <UnstyledButton
            sx={{
              display: "block",
              width: "100%",
              padding: theme.spacing.xs,
              borderRadius: theme.radius.sm,
              color:
                theme.colorScheme === "dark"
                  ? theme.colors.dark[0]
                  : theme.black,
              "&:hover": {
                backgroundColor:
                  theme.colorScheme === "dark"
                    ? theme.colors.dark[6]
                    : theme.colors.gray[0],
              },
            }}
          >
            <Group>
              <Avatar radius="xl" />
              <Box sx={{ flex: 1 }}>
                <Text size="sm">{name}</Text>
                <Text color="dimmed" size="xs">
                  {email}
                </Text>
              </Box>
            </Group>
          </UnstyledButton>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item icon={<IconSettings size={14} />}>Settings</Menu.Item>
          <Menu.Item
            onClick={() => {
              localStorage.removeItem("smart_book_token");
              router.push("/signin");
            }}
            icon={<IconPower size={14} />}
          >
            Logout
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </Box>
  );
};

export default User;
