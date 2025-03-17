"use client";

import { userLogout } from "@/actions/post";
import { useUserStore } from "@/stores/userStore";
import {
  ActionIcon,
  Avatar,
  Button,
  Flex,
  Menu,
  Title,
  useMantineColorScheme,
} from "@mantine/core";
import { IconMoon, IconSun } from "@tabler/icons-react";
import Link from "next/link";
import { useEffect, useState, useTransition } from "react";

const Navbar = () => {
  const { user, clearUser } = useUserStore();
  const [, startTransition] = useTransition();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const [mounted, setMounted] = useState(false); // Ensure hydration consistency

  useEffect(() => {
    setMounted(true); // Ensures this runs only on the client
  }, []);

  const handleLogout = () => {
    startTransition(() => {
      userLogout();
      clearUser();
    });
  };

  return (
    <Flex
      justify="space-between"
      align="center"
      py="md"
      px="lg"
      bg={mounted && colorScheme === "dark" ? "dark.7" : "white"}
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        width: "100%",
        boxShadow: "0px 2px 10px rgba(0,0,0,0.1)",
      }}
    >
      <Title
        size="h2"
        c={mounted && colorScheme === "dark" ? "gray.2" : "black"}
      >
        Sourcing & Canvassing
      </Title>

      <Flex align="center" gap="md">
        {/* Light Mode / Dark Mode Toggle */}
        {mounted && (
          <ActionIcon
            variant="light"
            size="lg"
            onClick={toggleColorScheme}
            aria-label="Toggle theme"
          >
            {colorScheme === "dark" ? (
              <IconSun size={18} />
            ) : (
              <IconMoon size={18} />
            )}
          </ActionIcon>
        )}

        {user ? (
          <Menu shadow="md" width={200} withinPortal>
            <Menu.Target>
              <Avatar
                src={user.user_avatar}
                radius="xl"
                size="md"
                style={{ cursor: "pointer", transition: "transform 0.2s ease" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "scale(1.1)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
              />
            </Menu.Target>

            <Menu.Dropdown style={{ zIndex: 1100 }}>
              <Menu.Label>Account</Menu.Label>
              <Menu.Item component={Link} href="/profile">
                View Profile
              </Menu.Item>
              <Menu.Item color="red" onClick={handleLogout}>
                Logout
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        ) : (
          <Flex gap="sm">
            <Button component={Link} href="/login" variant="outline">
              Sign In
            </Button>
            <Button
              component={Link}
              href="/register"
              variant="filled"
              color="blue"
            >
              Sign Up
            </Button>
          </Flex>
        )}
      </Flex>
    </Flex>
  );
};

export default Navbar;
