"use client";

import { userLogin } from "@/actions/post";
import {
  Alert,
  Button,
  Container,
  Paper,
  PasswordInput,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
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
    <Container size={420} my={40}>
      <Title ta="center">Welcome back!</Title>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        Don&apos;t have an account? <Link href="/register">Sign up</Link>
      </Text>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form action={handleSubmit}>
          {errors.form && <Alert color="red">{errors.form}</Alert>}

          <TextInput
            label="Email"
            placeholder="you@example.com"
            id="email"
            name="email"
            type="email"
            required
            error={errors.email}
            disabled={isPending}
          />

          <PasswordInput
            label="Password"
            placeholder="Your password"
            id="password"
            name="password"
            required
            mt="md"
            error={errors.password}
            disabled={isPending}
          />

          <Button
            fullWidth
            mt="xl"
            type="submit"
            disabled={isPending}
            loading={isPending}
          >
            Log in
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default LoginPage;
