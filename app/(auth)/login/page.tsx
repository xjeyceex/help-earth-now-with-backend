"use client";

import { userLogin } from "@/actions/post";
import { useUserStore } from "@/stores/userStore";
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
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const LoginPage = () => {
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    form?: string;
  }>({});
  const router = useRouter();
  const { user } = useUserStore();

  useEffect(() => {
    if (user) {
      router.replace("/dashboard");
    }
  }, [user, router]);

  const handleSubmit = async (formData: FormData) => {
    const result = await userLogin(formData);

    if (result?.error) {
      setErrors(result.error);
    } else {
      setErrors({});
    }
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
          />

          <PasswordInput
            label="Password"
            placeholder="Your password"
            id="password"
            name="password"
            required
            mt="md"
            error={errors.password}
          />

          <Button fullWidth mt="xl" type="submit">
            Log in
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default LoginPage;
