"use client";

import {
  Anchor,
  Box,
  Card,
  Container,
  Group,
  rem,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import {
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandTwitter,
  IconBrandYoutube,
  IconMail,
  IconMap,
  IconPhone,
} from "@tabler/icons-react";

const siteLinks = [
  { link: "/", label: "Home" },
  { link: "/features", label: "Features" },
  { link: "/pricing", label: "Pricing" },
  { link: "/contact", label: "Contact Us" },
];

const contactLinks = [
  {
    icon: IconMail,
    content: "help@canvassingapp.io",
  },
  {
    icon: IconPhone,
    content: "(+63) 931 056 1583",
  },
  {
    icon: IconMap,
    content:
      "Unit 115 Gold Annapolis Building, San Juan City, Metro Manila, Philippines",
  },
];

const Footer = () => {
  const contactItems = contactLinks.map((item) => (
    <Group key={item.content} gap="xs" mb={16} wrap="nowrap" align="flex-start">
      <Box>
        <item.icon size={20} />
      </Box>
      <Text c="dimmed" size="sm">
        {item.content}
      </Text>
    </Group>
  ));

  const siteItems = siteLinks.map((link) => (
    <Anchor
      key={link.label}
      href={link.link}
      c="dimmed"
      size="sm"
      w="fit-content"
      onClick={(event) => event.preventDefault()}
    >
      {link.label}
    </Anchor>
  ));

  const socialLinks = [
    { icon: IconBrandFacebook, label: "Facebook" },
    { icon: IconBrandTwitter, label: "Twitter" },
    { icon: IconBrandInstagram, label: "Instagram" },
    { icon: IconBrandYoutube, label: "Youtube" },
  ];

  return (
    <footer>
      <Card withBorder radius="none" mt={60}>
        <Container size="xl" py={32} px={{ md: 30, base: 0 }}>
          <SimpleGrid cols={{ base: 1, xs: 2, md: 3 }} spacing={46}>
            <Stack gap="md">
              {/* Logo */}
              <Anchor
                href="/"
                underline="never"
                fw={900}
                fz={rem(24)}
                style={{
                  letterSpacing: "-0.5px",
                  transition: "color 0.2s ease",
                  textTransform: "uppercase",
                }}
              >
                CANVASSINGAPP
              </Anchor>
              <Text size="sm" c="dimmed">
                Copyright © 2025, Canvassingapp. All Rights Reserved.
              </Text>
              <Group mt={12}>
                {socialLinks.map((link) => (
                  <Anchor key={link.label} c="dimmed">
                    <link.icon size={24} />
                  </Anchor>
                ))}
              </Group>
            </Stack>

            <Stack gap="md">
              <Title order={4} fw={600} size="md">
                Site Links
              </Title>
              <Stack gap={8}>{siteItems}</Stack>
            </Stack>

            <Stack gap="md">
              <Title order={4} fw={600} size="md">
                Get in Touch
              </Title>
              <Box>{contactItems}</Box>
            </Stack>
          </SimpleGrid>
        </Container>
      </Card>
    </footer>
  );
};

export default Footer;
