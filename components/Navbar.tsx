"use client";

import { userLogout } from "@/actions/post";
import { useUserStore } from "@/stores/userStore";
import {
  Anchor,
  Avatar,
  Button,
  Flex,
  Menu,
  rem,
  useMantineColorScheme,
} from "@mantine/core";
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
        borderBottom: `1px solid ${
          mounted && colorScheme === "dark" ? "#444" : "#ccc"
        }`,
      }}
    >
      <Anchor
        href="/"
        underline="never"
        fw={900}
        fz={rem(22)}
        style={{
          letterSpacing: "-0.5px",
          transition: "color 0.2s ease",
          textTransform: "uppercase",
        }}
      >
        CANVASSINGAPP
      </Anchor>

      <Flex align="center" gap="md">
        {mounted && <ModeToggle />}
        {user ? (
          <>
            <NotificationMenu />
            <Menu shadow="md" width={200} withinPortal>
              <Menu.Target>
                <Avatar
                  src={user.user_avatar}
                  radius="xl"
                  size="md"
                  style={{
                    cursor: "pointer",
                    transition: "transform 0.2s ease",
                  }}
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
          </>
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
