"use client";

import { userLogout } from "@/actions/post";
import { useUserStore } from "@/stores/userStore";
import { Avatar, Button, Flex, Menu, Title } from "@mantine/core";
import Link from "next/link";
import { useTransition } from "react";

const Navbar = () => {
  const { user, clearUser } = useUserStore();
  const [, startTransition] = useTransition();

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
      bg="gray.1"
      style={{
        position: "sticky",
        top: 0,
        zIndex: 1000, // Navbar stays on top
        width: "100%",
        boxShadow: "0px 2px 10px rgba(0,0,0,0.1)",
      }}
    >
      <Title size="h2">Sourcing & Canvassing</Title>

      {user ? (
        // Profile Menu if user is logged in
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
            {" "}
            {/* Higher than navbar */}
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
        // Sign In / Sign Up if user is not logged in
        <Flex gap="sm">
          <Button component={Link} href="/sign-in" variant="outline">
            Sign In
          </Button>
          <Button
            component={Link}
            href="/sign-up"
            variant="filled"
            color="blue"
          >
            Sign Up
          </Button>
        </Flex>
      )}
    </Flex>
  );
};

export default Navbar;
