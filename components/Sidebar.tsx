"use client";

import { useUserStore } from "@/stores/userStore";
import {
  Box,
  NavLink,
  Paper,
  rem,
  rgba,
  Stack,
  Text,
  useMantineColorScheme,
  useMantineTheme,
} from "@mantine/core";
import {
  IconBell,
  IconChevronRight,
  IconHome,
  IconTicket,
  IconUser,
} from "@tabler/icons-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const links = [
  {
    key: "dashboard",
    label: "Dashboard",
    icon: <IconHome style={{ width: rem(18), height: rem(18) }} />,
    href: "/dashboard",
  },
  {
    key: "profile",
    label: "Profile",
    icon: <IconUser style={{ width: rem(18), height: rem(18) }} />,
    href: "/profile",
  },
  {
    key: "tickets",
    label: "Tickets",
    icon: <IconTicket style={{ width: rem(18), height: rem(18) }} />,
    href: "/tickets",
  },
  {
    key: "notifications",
    label: "Notifications",
    icon: <IconBell style={{ width: rem(18), height: rem(18) }} />,
    href: "/notifications",
  },
];

const Sidebar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useUserStore();
  const { colorScheme } = useMantineColorScheme();
  const theme = useMantineTheme();
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
    <Paper
      w={280}
      h="100vh"
      p="md"
      pos="fixed"
      left={0}
      radius={0}
      style={{
        borderRight: `1px solid ${
          colorScheme === "dark" ? "#2C2E33" : "#E9ECEF"
        }`,
      }}
    >
      <Stack h="100%" justify="space-between">
        <Stack gap="xl">
          {/* Navigation Linksssssssssssssss */}
          <Stack gap={6}>
            <Text size="sm" fw={500} c="dimmed" pb={4} pl="xs">
              MAIN MENU
            </Text>
            {links.map((link) => (
              <NavLink
                key={link.key}
                leftSection={
                  <Box
                    style={{
                      color: isActive(link.href)
                        ? theme.colors[theme.primaryColor][
                            colorScheme === "dark" ? 4 : 6
                          ]
                        : colorScheme === "dark"
                          ? theme.colors.dark[0]
                          : theme.colors.gray[7],
                      position: "relative",
                      top: 3,
                    }}
                  >
                    {link.icon}
                  </Box>
                }
                label={link.label}
                active={isActive(link.href)}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigation(link.href);
                }}
                rightSection={
                  <IconChevronRight
                    style={{
                      width: rem(14),
                      height: rem(14),
                      opacity: isActive(link.href) ? 1 : 0.3,
                      color: isActive(link.href)
                        ? theme.colors[theme.primaryColor][
                            colorScheme === "dark" ? 4 : 6
                          ]
                        : "inherit",
                    }}
                  />
                }
                disabled={isNavigating}
                styles={{
                  root: {
                    borderRadius: theme.radius.md,
                    fontSize: theme.fontSizes.sm,
                    fontWeight: 500,
                    "&[dataActive]": {
                      backgroundColor:
                        colorScheme === "dark"
                          ? rgba(theme.colors[theme.primaryColor][9], 0.15)
                          : rgba(theme.colors[theme.primaryColor][0], 0.35),
                      color:
                        theme.colors[theme.primaryColor][
                          colorScheme === "dark" ? 4 : 6
                        ],
                      "&:hover": {
                        backgroundColor:
                          colorScheme === "dark"
                            ? rgba(theme.colors[theme.primaryColor][9], 0.2)
                            : rgba(theme.colors[theme.primaryColor][0], 0.45),
                      },
                    },
                  },
                }}
              />
            ))}
          </Stack>
        </Stack>
      </Stack>
    </Paper>
  );
};

export default Sidebar;
