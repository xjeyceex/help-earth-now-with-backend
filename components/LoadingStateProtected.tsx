"use client";

import {
  Box,
  Group,
  Loader,
  Paper,
  rem,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useEffect, useState } from "react";

const LoadingStateProtected = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        const increment =
          100 - oldProgress > 40
            ? Math.random() * 15 + 5
            : Math.random() * 8 + 2;

        return Math.min(oldProgress + increment, 99.5);
      });
    }, 100);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <>
      {/* Progress Bar */}
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

      {/* Absolute Centered Loading */}
      <Box
        style={{
          height: "100vh", // Full height of the viewport
          width: "100vw", // Full width of the viewport
          display: "flex",
          justifyContent: "center", // Center horizontally
          alignItems: "center", // Center vertically
          position: "absolute",
          top: 0,
          left: 0,
        }}
        pl={{ base: 0, md: 300 }}
      >
        <Paper
          p="lg"
          radius="md"
          withBorder={false}
          style={{ background: "transparent" }}
        >
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
      </Box>
    </>
  );
};

export default LoadingStateProtected;
