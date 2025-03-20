"use client";

import { userLogin } from "@/actions/post";
import {
  Alert,
  Anchor,
  Box,
  Button,
  Center,
  Paper,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title,
  rem,
} from "@mantine/core";
import { IconAt, IconLock } from "@tabler/icons-react";
import Link from "next/link";
import { useState, useTransition } from "react";

const LoginPage = () => {
  const [isPending, startTransition] = useTransition();
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    form?: string;
  }>({});

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      const result = await userLogin(formData);
      if (result?.error) {
        setErrors(result.error);
      } else {
        setErrors({});
      }
    });
  };

  return (
    <Box w={{ base: "100%" }} mt={70}>
      <Center h="100%" p="xl">
        <Stack w={450} gap="lg">
          <Stack gap={5}>
            <Title order={1} size="2rem" fw={800}>
              Welcome back
            </Title>
            <Text c="dimmed" size="md">
              Please enter your credentials to continue.
            </Text>
          </Stack>

          <Paper w="100%" radius="md">
            <form action={handleSubmit}>
              <Stack gap="md">
                {errors.form && (
                  <Alert variant="light" color="red" radius="md">
                    {errors.form}
                  </Alert>
                )}

                <Stack gap="sm">
                  <TextInput
                    label="Email address"
                    placeholder="your@email.com"
                    size="md"
                    radius="md"
                    id="email"
                    name="email"
                    type="email"
                    required
                    error={errors.email}
                    disabled={isPending}
                    leftSection={
                      <IconAt style={{ width: rem(18), height: rem(18) }} />
                    }
                  />

                  <PasswordInput
                    label="Password"
                    placeholder="Your password"
                    size="md"
                    radius="md"
                    id="password"
                    name="password"
                    required
                    error={errors.password}
                    disabled={isPending}
                    leftSection={
                      <IconLock style={{ width: rem(18), height: rem(18) }} />
                    }
                  />

                  <Anchor
                    component={Link}
                    href="/forgot-password"
                    size="sm"
                    ta="right"
                    display="block"
                    mt={5}
                  >
                    Forgot your password?
                  </Anchor>
                </Stack>

                <Button
                  fullWidth
                  size="md"
                  radius="md"
                  type="submit"
                  disabled={isPending}
                  loading={isPending}
                  h={48}
                >
                  Sign in to your account
                </Button>

                <Text ta="center" mt="md">
                  Don&apos;t have an account?{" "}
                  <Anchor component={Link} href="/register" fw={700}>
                    Sign up
                  </Anchor>
                </Text>
              </Stack>
            </form>
          </Paper>
        </Stack>
      </Center>
    </Box>
  );
};

export default LoginPage;
