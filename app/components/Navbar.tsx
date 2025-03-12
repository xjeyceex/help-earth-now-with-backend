"use client";

import { userLogout } from "@/actions/post";
import { useUserStore } from "@/stores/userStore";
import { Avatar, Button, Flex, Menu, Text, Title } from "@mantine/core";
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

  if (!user) return null;

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
        zIndex: 1000, // Ensures it's above other elements
        width: "100%", // Full-width
        boxShadow: "0px 2px 10px rgba(0,0,0,0.1)", // Optional shadow for visibility
      }}
    >
      <Title size="h2">Sourcing & Canvassing</Title>

      {/* Profile Menu */}
      <Menu shadow="md" width={200}>
        <Menu.Target>
          <Button variant="subtle" p="xs">
            <Flex align="center" gap="sm">
              <Avatar src={user.user_avatar} radius="xl" size="md" />
              <Text>{user.user_full_name}</Text>
            </Flex>
          </Button>
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Label>Account</Menu.Label>
          <Menu.Item component={Link} href="/profile">
            View Profile
          </Menu.Item>
          <Menu.Item color="red" onClick={handleLogout}>
            Logout
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </Flex>
  );
};

export default Navbar;
