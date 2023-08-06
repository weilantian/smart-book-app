import {
  Button,
  Container,
  Group,
  SimpleGrid,
  Stack,
  Switch,
  Title,
} from "@mantine/core";
import { QueryFunctionContext, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { FC, useEffect, useState } from "react";
import EventCard from "../components/EventCard";
import Layout from "../components/Layout";
import useCurrentUser from "../hooks/useCurrentUser";
import useIsAuthorized from "../hooks/useIsAuthroized";
import { getUserManagedEvents } from "../lib/endpoint";
import { NextPageWithLayout } from "./_app";

const getUserManagedEventsQueryKey = (showEnd: boolean) => {
  return ["user-managed-events", showEnd ? "show-end" : "hide-end"];
};

const ManagedEvents = () => {
  const [showEnd, setShowEnd] = useState(false);
  const { data } = useQuery(
    getUserManagedEventsQueryKey(showEnd),
    ({ queryKey }: QueryFunctionContext) => {
      const [key, showEnd] = queryKey as ReturnType<
        typeof getUserManagedEventsQueryKey
      >;
      return getUserManagedEvents(showEnd === "show-end");
    }
  );
  return (
    <>
      <Group position="apart">
        <Title order={4}>Events manage by you</Title>
        <Switch
          checked={showEnd}
          onChange={(e) => setShowEnd(e.currentTarget.checked)}
          label="Includes Ended"
        />
      </Group>

      <SimpleGrid spacing="lg" cols={3}>
        {data?.data.map((event) => (
          <EventCard
            id={event.id}
            participators={event.participatorNum}
            status={event.status}
            key={event.id}
            slots={0}
            name={event.name}
          />
        ))}
      </SimpleGrid>
    </>
  );
};

const Web: NextPageWithLayout = () => {
  const router = useRouter();
  const { data } = useCurrentUser();
  const { isAuthorized } = useIsAuthorized();
  useEffect(() => {
    if (isAuthorized) return;
    router.push("/signin");
  }, [isAuthorized, router]);
  return (
    <Container
      size="md"
      sx={{
        marginTop: "20px",
      }}
    >
      <Stack>
        {data?.data && <Title order={3}>Welcome back, {data?.data.name}</Title>}
        <ManagedEvents />
      </Stack>
    </Container>
  );
};

Web.getLayout = (page) => <Layout>{page}</Layout>;

export default Web;
