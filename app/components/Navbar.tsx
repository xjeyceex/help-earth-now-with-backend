"use client";

import { useUserStore } from "@/stores/userStore";
import { Avatar, Button, Flex, Menu, Text, Title } from "@mantine/core";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const { user, setUser } = useUserStore();
  const router = useRouter();

  const handleLogout = () => {
    setUser(null);
    router.push("/login");
  };

  return (
    <Flex justify="space-between" align="center" py="md" px="lg" bg="gray.1">
      <Title size="h2">Sourcing & Canvassing</Title>

      {/* Profile Menu */}
      {user && (
        <Menu shadow="md" width={200}>
          <Menu.Target>
            <Button variant="subtle" p="xs">
              <Flex align="center" gap="sm">
                <Avatar
                  src={user.user_avatar || "/default-avatar.png"}
                  radius="xl"
                  size="md"
                />
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
      )}
    </Flex>
  );
};

export default Navbar;
