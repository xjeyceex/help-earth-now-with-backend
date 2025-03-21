"use client";

import { userLogout } from "@/actions/post";
import { useUserStore } from "@/stores/userStore";
import {
  ActionIcon,
  Avatar,
  Box,
  Button,
  Divider,
  Flex,
  Group,
  Menu,
  rem,
  Text,
  useMantineColorScheme,
} from "@mantine/core";
import { IconLogout, IconUser, IconUserCircle } from "@tabler/icons-react";
import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import NotificationMenu from "./NotificationMenu";
import ModeToggle from "./ThemeToggle";

const Navbar = () => {
  const { user, clearUser } = useUserStore();
  const [, startTransition] = useTransition();
  const { colorScheme } = useMantineColorScheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = () => {
    startTransition(() => {
      userLogout();
      clearUser();
    });
  };

  if (!mounted) return null;

  return (
    <Box
      py="md"
      px="xl"
      bg={colorScheme === "dark" ? "dark.7" : "white"}
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        width: "100%",
        boxShadow: "0px 2px 10px rgba(0,0,0,0.05)",
        borderBottom: `1px solid ${
          colorScheme === "dark" ? "#2C2E33" : "#E9ECEF"
        }`,
      }}
    >
      <Flex justify="space-between" align="center" h={rem(50)}>
        <Text>TODO: Sidebar Menu</Text>
        <Group gap="md">
          <ModeToggle />
          {user ? (
            <Group gap="sm">
              <NotificationMenu />
              <Menu shadow="md" width={200} position="bottom-end" withinPortal>
                <Menu.Target>
                  <ActionIcon
                    size="lg"
                    radius="xl"
                    style={{
                      transition: "transform 0.2s ease",
                    }}
                  >
                    {user.user_avatar ? (
                      <Avatar
                        src={user.user_avatar}
                        radius="xl"
                        size="md"
                        alt={user.user_full_name || "User avatar"}
                      />
                    ) : (
                      <Avatar
                        radius="xl"
                        size="md"
                        color="primary"
                        variant="filled"
                      >
                        {user.user_full_name?.charAt(0).toUpperCase() || (
                          <IconUserCircle size={24} />
                        )}
                      </Avatar>
                    )}
                  </ActionIcon>
                </Menu.Target>

                <Menu.Dropdown>
                  <Menu.Label>
                    <Text size="sm" fw={500} c="dark">
                      {user.user_full_name}
                    </Text>
                    <Text size="xs" c="dimmed">
                      {user.user_email}
                    </Text>
                  </Menu.Label>
                  <Divider my={8} />
                  <Menu.Item
                    component={Link}
                    href="/profile"
                    leftSection={
                      <IconUser style={{ width: rem(14), height: rem(14) }} />
                    }
                  >
                    View Profile
                  </Menu.Item>
                  <Menu.Item
                    color="red"
                    onClick={handleLogout}
                    leftSection={
                      <IconLogout style={{ width: rem(14), height: rem(14) }} />
                    }
                  >
                    Logout
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </Group>
          ) : (
            <Group gap="sm">
              <Button
                component={Link}
                href="/login"
                variant="outline"
                radius="md"
              >
                Sign In
              </Button>
              <Button component={Link} href="/register" radius="md">
                Sign Up
              </Button>
            </Group>
          )}
        </Group>
      </Flex>
    </Box>
  );
};

export default Navbar;
