"use client";

import { userRegister } from "@/actions/post";
import {
  Button,
  Container,
  Paper,
  PasswordInput,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconCheck } from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

const RegisterPage = () => {
  const [errors, setErrors] = useState<string | null>(null);
  const router = useRouter();

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

  return (
    <Container size={420} my={40}>
      <Title ta="center">Create an Account</Title>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        Already have an account? <Link href="/login">Log in</Link>
      </Text>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form onSubmit={onSubmit}>
          <TextInput
            label="Full Name"
            name="name"
            placeholder="John Doe"
            required
          />
          <TextInput
            label="Email"
            name="email"
            placeholder="you@example.com"
            type="email"
            mt="md"
            required
          />
          <PasswordInput
            label="Password"
            name="password"
            placeholder="Your password"
            mt="md"
            required
          />

          {errors && (
            <Text color="red" size="sm" mt="md">
              {errors}
            </Text>
          )}

          <Button fullWidth mt="xl" type="submit">
            Register
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default RegisterPage;
