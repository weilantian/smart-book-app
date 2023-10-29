import { getBookableDetails } from "@/lib/endpoint";
import { Bookable } from "@/lib/models";
import { GetServerSideProps, NextPage } from "next";

const BookingPage: NextPage<{ bookable: Bookable }> = () => {
  return <div></div>;
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const id = params?.id as string;
  if (!id) throw new Error("No id provided");

  const bookable = await getBookableDetails(id);

  if (!bookable) return { notFound: true, props: {} };
  return {
    props: {
      bookable,
    },
  };
};

export default BookingPage;
