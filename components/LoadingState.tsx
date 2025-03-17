"use client";

import {
  Box,
  Center,
  Container,
  Group,
  Loader,
  Paper,
  rem,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useEffect, useState } from "react";

const LoadingState = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        // Make progress faster with larger increments
        const increment =
          100 - oldProgress > 40
            ? Math.random() * 15 + 5
            : Math.random() * 8 + 2;

        const newProgress = Math.min(oldProgress + increment, 99.5);
        return newProgress;
      });
    }, 100); // Reduced interval for faster updates

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <>
      <Box
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          height: rem(3),
          width: `${progress}%`,
          backgroundColor: "var(--mantine-color-blue-6)",
          zIndex: 1000,
          transition: "width 0.15s linear",
        }}
      />

      <Container>
        <Center h="100vh">
          <Paper>
            <Stack align="center" gap="md">
              <Title order={4} c="dimmed">
                Please wait
              </Title>
              <Loader size="lg" type="dots" color="blue" />
              <Group>
                <Text size="sm" c="dimmed">
                  Loading your content...
                </Text>
              </Group>
            </Stack>
          </Paper>
        </Center>
      </Container>
    </>
  );
};

export default LoadingState;
