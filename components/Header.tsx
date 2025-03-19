"use client";

import {
  Anchor,
  Burger,
  Button,
  Container,
  Drawer,
  Flex,
  Group,
  rem,
  Stack,
  Text,
  useMantineColorScheme,
  useMantineTheme,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useRouter } from "next/navigation";
import ModeToggle from "./ModeToggle";

const Header = () => {
  const theme = useMantineTheme();

  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === "dark";

  const router = useRouter();

  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] =
    useDisclosure(false);

  const headerLinks = [
    { label: "Home", href: "/" },
    { label: "About", href: "#about" },
    { label: "Features", href: "#features" },
    { label: "Contact Us", href: "#contact-us" },
  ];

  return (
    <>
      <Container size="xl" style={{ zIndex: 10000 }} w="100%">
        <header>
          <Group justify="space-between" h={70}>
            {/* Logo */}
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

            {/* Header Links */}
            <Group h="100%" gap={40} visibleFrom="sm">
              {headerLinks.map((headerLink) => (
                <Anchor
                  key={headerLink.label}
                  href={headerLink.href}
                  underline="never"
                  fw={500}
                  size="sm"
                  c={isDark ? "white" : "black"}
                  style={{
                    transition: "all 0.2s ease",
                    position: "relative",
                    padding: "8px 0",
                  }}
                >
                  {headerLink.label}
                </Anchor>
              ))}
            </Group>

            <Group visibleFrom="sm" gap="md">
              <ModeToggle />
              <Button
                radius="md"
                size="sm"
                onClick={() => router.push("/login")}
              >
                Log in
              </Button>
            </Group>

            <Burger
              opened={drawerOpened}
              onClick={toggleDrawer}
              hiddenFrom="sm"
              size="sm"
              color={isDark ? theme.colors.gray[3] : theme.colors.gray[7]}
            />
          </Group>
        </header>
      </Container>

      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        size="100%"
        padding="md"
        title={
          <Text
            fw={900}
            size="xl"
            c={theme.colors[theme.primaryColor][isDark ? 4 : 6]}
            style={{
              letterSpacing: "-0.5px",
              fontFamily: theme.headings.fontFamily,
              textTransform: "uppercase",
            }}
          >
            CanvassingApp
          </Text>
        }
        hiddenFrom="sm"
        zIndex={1000}
      >
        <Flex direction="column" justify="center" align="center">
          <Stack gap="xl" px="md">
            {headerLinks.map((link) => (
              <Anchor
                key={link.label}
                href={link.href}
                underline="never"
                fw={500}
                size="sm"
                ta="center"
                onClick={closeDrawer}
                c={isDark ? "white" : "black"}
                style={{
                  transition: "color 0.2s ease",
                }}
              >
                {link.label}
              </Anchor>
            ))}
          </Stack>

          <Button fullWidth mt="xl" onClick={() => router.push("/login")}>
            Log in
          </Button>
        </Flex>
      </Drawer>
    </>
  );
};

export default Header;
