"use client";

import { userRegister } from "@/actions/post";
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
import { notifications } from "@mantine/notifications";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import {
  IconAt,
  IconBrandGoogle,
  IconCheck,
  IconLock,
  IconUser,
} from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

const RegisterPage = () => {
  const [errors, setErrors] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClientComponentClient();

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const res = await userRegister(formData);

    if (res?.error) {
      setErrors(res.message);
      return;
    }

    notifications.show({
      title: "Success",
      message: "Email confirmation sent. Please check your email.",
      color: "green",
      icon: <IconCheck size={16} />,
    });
    router.push("/login");
  };

  const handleGoogleSignIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`, // Redirect to auth callback page
      },
    });

    if (error) {
      notifications.show({
        title: "Error",
        message: error.message,
        color: "red",
      });
    }
  };

  return (
    <Box h="100%" mt={70}>
      <Center h="100%" p="xl">
        <Stack w={450} gap="lg">
          <Stack gap={5}>
            <Title order={1} size="2rem" fw={800}>
              Create Account
            </Title>
            <Text c="dimmed" size="md">
              Join us today and get started
            </Text>
          </Stack>

          <Paper w="100%" radius="md">
            <form onSubmit={onSubmit}>
              <Stack gap="md">
                {errors && (
                  <Alert variant="light" color="red" radius="md">
                    {errors}
                  </Alert>
                )}

                <Stack gap="sm">
                  <TextInput
                    label="Full Name"
                    placeholder="John Doe"
                    size="md"
                    radius="md"
                    name="name"
                    required
                    leftSection={
                      <IconUser style={{ width: rem(18), height: rem(18) }} />
                    }
                  />

                  <TextInput
                    label="Email address"
                    placeholder="you@example.com"
                    size="md"
                    radius="md"
                    name="email"
                    type="email"
                    required
                    leftSection={
                      <IconAt style={{ width: rem(18), height: rem(18) }} />
                    }
                  />

                  <PasswordInput
                    label="Password"
                    placeholder="Create a strong password"
                    size="md"
                    radius="md"
                    name="password"
                    required
                    leftSection={
                      <IconLock style={{ width: rem(18), height: rem(18) }} />
                    }
                  />
                </Stack>

                <Button fullWidth size="md" radius="md" type="submit" h={48}>
                  Create your account
                </Button>

                <Button
                  fullWidth
                  size="md"
                  radius="md"
                  variant="outline"
                  leftSection={
                    <IconBrandGoogle
                      style={{ width: rem(18), height: rem(18) }}
                    />
                  }
                  onClick={handleGoogleSignIn}
                  h={48}
                >
                  Sign up with Google
                </Button>

                <Text ta="center" mt="md">
                  Already have an account?{" "}
                  <Anchor component={Link} href="/login" fw={700}>
                    Sign in
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

export default RegisterPage;
