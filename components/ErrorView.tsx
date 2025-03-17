"use client";

import { Button, Flex, Group, Text, Title, rem } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import { useRouter } from "next/navigation";

type ErrorViewProps = {
  statusCode: number;
  errorTitle: string;
  errorDescription: string;
};

const ErrorView = ({
  statusCode,
  errorTitle,
  errorDescription,
}: ErrorViewProps) => {
  const router = useRouter();

  return (
    <Flex h="100vh" align="start" justify="center" pt={160}>
      <div style={{ textAlign: "center" }}>
        <Title
          c="blue"
          style={{
            fontSize: rem(148),
            fontWeight: 900,
            lineHeight: 1,
          }}
        >
          {statusCode}
        </Title>
        <Title
          style={{
            fontFamily: "Greycliff CF, sans-serif",
            textAlign: "center",
            fontWeight: 900,
            fontSize: rem(38),
          }}
          mt={24}
        >
          {errorTitle}
        </Title>
        <Text c="dimmed" size="lg" ta="center" maw={500} mx="auto" mt="xl">
          {errorDescription}
        </Text>
        <Group justify="center" mt={70}>
          <Button
            size="md"
            leftSection={<IconArrowLeft size={20} />}
            onClick={() => router.back()}
            variant="light"
          >
            Get back
          </Button>
          <Button size="md" onClick={() => router.push("/")}>
            Get to home page
          </Button>
        </Group>
      </div>
    </Flex>
  );
};

export default ErrorView;
