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
  Menu,
} from "@mantine/core";
import { NextLink } from "@mantine/next";
import Link from "next/link";
import { FC, PropsWithChildren, useState } from "react";
import useCurrentUser from "../hooks/useCurrentUser";
import CreateEventModal from "./Modal/CreateProjectModal";
import User from "./Nav/User";

const Layout: FC<PropsWithChildren<{}>> = ({ children }) => {
  const { data } = useCurrentUser();
  const [creatingEvent, setCreatingEvent] = useState(false);
  return (
    <>
      <CreateEventModal
        onClose={() => setCreatingEvent(false)}
        opened={creatingEvent}
      />
      <AppShell
        padding="md"
        navbar={
          <Navbar width={{ base: 300 }} p="xs">
            <Navbar.Section>{/* Header with logo */}</Navbar.Section>
            <Navbar.Section grow mt="md">
              {/* Links sections */}
            </Navbar.Section>
            <Navbar.Section>
              {data?.data && (
                <User email={data?.data.email} name={data?.data.name} />
              )}
            </Navbar.Section>
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

              <Button onClick={() => setCreatingEvent(true)}>
                Create Event
              </Button>
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
    </>
  );
};

export default Layout;
