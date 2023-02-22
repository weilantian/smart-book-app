import { Button } from "@mantine/core";
import { FC } from "react";
import Layout from "../components/Layout";
import { NextPageWithLayout } from "./_app";

const Web: NextPageWithLayout = () => {
  return (
    <div>
      <Button>A cool button</Button>
    </div>
  );
};

Web.getLayout = (page) => <Layout>{page}</Layout>;

export default Web;
