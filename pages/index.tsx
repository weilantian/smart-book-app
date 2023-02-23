import { Button, Container, SimpleGrid, Stack, Title } from "@mantine/core";
import { useRouter } from "next/router";
import { FC, useEffect } from "react";
import EventCard from "../components/EventCard";
import Layout from "../components/Layout";
import useIsAuthorized from "../hooks/useIsAuthroized";
import { NextPageWithLayout } from "./_app";

const Web: NextPageWithLayout = () => {
  const router = useRouter();
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
        <Title order={3}>Welcome back, Lantian</Title>
        <Title order={4}>Events manage by you</Title>
        <SimpleGrid spacing="lg" cols={3}>
          <EventCard />
          <EventCard />
          <EventCard />
          <EventCard />
        </SimpleGrid>
      </Stack>
    </Container>
  );
};

Web.getLayout = (page) => <Layout>{page}</Layout>;

export default Web;
