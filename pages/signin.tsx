import {
  Button,
  Input,
  Paper,
  Stack,
  TextInput,
  PasswordInput,
  Group,
  Anchor,
  Checkbox,
} from "@mantine/core";
import { NextPage } from "next";
import { useToggle } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import { useMutation } from "@tanstack/react-query";
import { login, signup, updateToken } from "../lib/endpoint";
import { useRouter } from "next/router";

import classes from "@/styles/Signin.module.css";

const LoginPage: NextPage = () => {
  const [type, toggle] = useToggle(["login", "register"]);

  const router = useRouter();
  const { mutate, isLoading } = useMutation({
    mutationFn: type == "register" ? signup : login,
    onSuccess: ({ data }) => {
      localStorage.setItem("smart_book_token", data.access_token);
      updateToken(data.access_token);
      router.push("/");
    },
    onError: (error) => console.log(error),
  });
  const form = useForm({
    initialValues: {
      email: "",
      name: "",
      password: "",
      repeatPassword: "",
      terms: false,
    },
    validate: {
      email: (val) => (/^\S+@\S+$/.test(val) ? null : "Invalid email"),
      name: (value) => type == "register" && !value && "Name is required",
      password: (value) =>
        value.length < 6 && "Password must be at least 6 chars",
      repeatPassword: (value, { password }) =>
        type == "register" && value !== password && "Passwords must match",
      terms: (value) =>
        type == "register" && !value && "You must accept terms and conditions",
    },
  });
  return (
    <div className={classes.page}>
      <div className={classes.inner}>
        <h1>SmartBook</h1>
        <Paper
          style={{
            margin: "auto",
            width: 420,
          }}
          radius="md"
          p="xl"
          withBorder
        >
          <form
            onSubmit={form.onSubmit((input) => {
              if (type == "register") {
                mutate({
                  name: input.name,
                  email: input.email,
                  password: input.password,
                });
              } else {
                //@ts-ignore
                mutate({
                  email: input.email,
                  password: input.password,
                });
              }
            })}
          >
            <Stack>
              <Button onClick={() => router.push("/demo")}>
                Sign in with Demo Account
              </Button>
              <TextInput
                onChange={(e) =>
                  form.setFieldValue("email", e.currentTarget.value)
                }
                value={form.values.email}
                label="Email"
                placeholder="Email"
                error={form.errors.email}
              />
              {type === "register" && (
                <TextInput
                  onChange={(e) =>
                    form.setFieldValue("name", e.currentTarget.value)
                  }
                  value={form.values.name}
                  label="Name"
                  placeholder="Name"
                  error={form.errors.name}
                />
              )}
              <PasswordInput
                value={form.values.password}
                onChange={(e) =>
                  form.setFieldValue("password", e.currentTarget.value)
                }
                error={form.errors.password}
                label="Password"
                placeholder="Password"
              />
              {type === "register" && (
                <PasswordInput
                  value={form.values.repeatPassword}
                  onChange={(e) =>
                    form.setFieldValue("repeatPassword", e.currentTarget.value)
                  }
                  label="Repeat Password"
                  placeholder="Repeat password"
                  error={form.errors.repeatPassword}
                />
              )}

              <Checkbox
                onChange={(e) =>
                  form.setFieldValue("terms", e.currentTarget.checked)
                }
                checked={form.values.terms}
                error={form.errors.terms}
                label="I accept terms and conditions"
              />
              <Group justify="space-between" mt="xl">
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

                <Button loading={isLoading} type="submit">
                  Login
                </Button>
              </Group>
            </Stack>
          </form>
        </Paper>
      </div>
    </div>
  );
};

export default LoginPage;
