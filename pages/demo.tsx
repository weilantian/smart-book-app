import { login, updateToken } from "@/lib/endpoint";
import { Box, Text } from "@mantine/core";
import { useRouter } from "next/router";
import { useEffect } from "react";

const SigninWithDemoAccountPage = () => {
  const router = useRouter();
  useEffect(() => {
    const signInWithDemoAccount = async () => {
      // Check if the user has already logged in

      if (localStorage.getItem("smart_book_token")) {
        router.push("/bookable/create");
        return;
      }

      const response = await login({
        email: "demo@smartbook.io",
        password: "smartbook_demo_account_password",
      });
      if (!response.data.access_token) return;
      localStorage.setItem("smart_book_token", response.data.access_token);
      updateToken(response.data.access_token);
      router.push("/bookable/create");
    };

    signInWithDemoAccount();
  }, [router]);
  return (
    <Box>
      <Text>Please Wait...</Text>
    </Box>
  );
};

export default SigninWithDemoAccountPage;
