import {
  AppShell,
  Navbar,
  Header,
  Stack,
  createStyles,
  Text,
  Burger,
  MediaQuery,
  Group,
  Button,
} from "@mantine/core";
import { NextLink } from "@mantine/next";
import Link from "next/link";
import { FC, PropsWithChildren } from "react";

const Layout: FC<PropsWithChildren<{}>> = ({ children }) => {
  return (
    <AppShell
      padding="md"
      navbar={
        <Navbar width={{ base: 300 }} p="xs">
          <Navbar.Section>{/* Header with logo */}</Navbar.Section>
          <Navbar.Section grow mt="md">
            {/* Links sections */}
          </Navbar.Section>
          <Navbar.Section>{/* Footer with user */}111</Navbar.Section>
        </Navbar>
      }
      header={
        <Header height={{ base: 50, md: 70 }} p="md">
          <Group
            sx={{
              display: "flex",
              alignItems: "center",
              height: "100%",
              width: "100%",
            }}
            position="apart"
          >
            <Text weight={700}>SmartBook</Text>
            <Link href="/signin">
              <Button>Create Event</Button>
            </Link>
          </Group>
        </Header>
      }
      styles={(theme) => ({
        main: {
          backgroundColor:
            theme.colorScheme === "dark"
              ? theme.colors.dark[8]
              : theme.colors.gray[0],
        },
      })}
    >
      {children}
    </AppShell>
  );
};

export default Layout;
