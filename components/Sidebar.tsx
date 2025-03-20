"use client";

import { useUserStore } from "@/stores/userStore";
import {
  Box,
  NavLink,
  Stack,
  Text,
  useMantineColorScheme,
} from "@mantine/core";
import { IconBell, IconHome, IconTicket, IconUser } from "@tabler/icons-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const links = [
  {
    key: "dashboard",
    label: "Dashboard",
    icon: <IconHome size={18} />,
    href: "/dashboard",
  },
  {
    key: "profile",
    label: "Profile",
    icon: <IconUser size={18} />,
    href: "/profile",
  },
  {
    key: "tickets",
    label: "Tickets",
    icon: <IconTicket size={18} />,
    href: "/tickets",
  },
  {
    key: "notifications",
    label: "Notifications",
    icon: <IconBell size={18} />,
    href: "/notifications",
  },
];

const Sidebar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useUserStore();
  const { colorScheme } = useMantineColorScheme();
  const [mounted, setMounted] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleNavigation = (href: string) => {
    if (isNavigating || pathname === href) return;
    setIsNavigating(true);
    router.push(href);

    setTimeout(() => {
      setIsNavigating(false);
    }, 500);
  };

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  if (!mounted || !user) return null;

  return (
    <Box
      w={300}
      h="100vh"
      p="md"
      pos="fixed"
      left={0}
      style={{
        borderRight: `1px solid ${colorScheme === "dark" ? "#444" : "#ccc"}`,
      }}
    >
      <Stack
        gap="xs"
        style={{
          border: `1px solid ${colorScheme === "dark" ? "#444" : "#ccc"}`,
          borderRadius: "4px",
          padding: "1rem",
        }}
      >
        <Text size="sm" pb="sm">
          Links
        </Text>
        {links.map((link) => (
          <NavLink
            key={link.key}
            label={
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                {link.icon} {link.label}
              </div>
            }
            active={isActive(link.href)}
            onClick={(e) => {
              e.preventDefault();
              handleNavigation(link.href);
            }}
            c={colorScheme === "dark" ? "white" : "black"}
            style={{
              borderRadius: "8px",
              cursor: isNavigating ? "not-allowed" : "pointer",
              transition: "background-color 0.2s ease",
              opacity: isNavigating ? 0.7 : 1,
            }}
          />
        ))}
      </Stack>
    </Box>
  );
};

export default Sidebar;
