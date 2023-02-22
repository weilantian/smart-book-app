import {
  Button,
  createStyles,
  Input,
  Paper,
  Stack,
  TextInput,
  PasswordInput,
  Group,
  Anchor,
} from "@mantine/core";
import { NextPage } from "next";
import { useToggle } from "@mantine/hooks";

const useStyles = createStyles((theme) => ({
  page: {
    background: theme.colors.gray[1],
    height: "100vh",
  },
  inner: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
}));

const LoginPage: NextPage = () => {
  const [type, toggle] = useToggle(["login", "register"]);
  const { classes } = useStyles();
  return (
    <div className={classes.page}>
      <div className={classes.inner}>
        <h1>SmartBook</h1>
        <Paper
          sx={{
            margin: "auto",
            width: 420,
          }}
          radius="md"
          p="xl"
          withBorder
        >
          <form>
            <Stack>
              <Button>Sign in with Google</Button>
              <TextInput label="Email" placeholder="Email" />
              <PasswordInput label="Password" placeholder="Password" />
              <Group position="apart" mt="xl">
                <Anchor
                  component="button"
                  type="button"
                  color="dimmed"
                  onClick={() => toggle()}
                  size="xs"
                >
                  {type === "register"
                    ? "Already have an account? Login"
                    : "Don't have an account? Register"}
                </Anchor>
                <Button>Login</Button>
              </Group>
            </Stack>
          </form>
        </Paper>
      </div>
    </div>
  );
};

export default LoginPage;
