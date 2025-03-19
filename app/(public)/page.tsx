"use client";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import {
  AppShell,
  Box,
  Button,
  Card,
  Container,
  Grid,
  Group,
  List,
  rem,
  SimpleGrid,
  Text,
  ThemeIcon,
  Title,
  useMantineColorScheme,
  useMantineTheme,
} from "@mantine/core";

import {
  IconArrowRight,
  IconChartBar,
  IconCheck,
  IconDeviceMobile,
  IconMap,
  IconUsers,
} from "@tabler/icons-react";

export default function HomePage() {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === "dark";

  const styles = {
    title: {
      fontWeight: 800,
      fontSize: rem(40),
      letterSpacing: -1,
      paddingLeft: theme.spacing.md,
      paddingRight: theme.spacing.md,
      color: isDark ? theme.white : theme.black,
      marginBottom: theme.spacing.xs,
    },

    highlight: {
      color: theme.colors[theme.primaryColor][isDark ? 4 : 6],
      fontWeight: 800,
      letterSpacing: -1,
      paddingRight: theme.spacing.sm,
    },

    description: {
      color: isDark ? theme.colors.dark[1] : theme.colors.gray[7],
      paddingLeft: theme.spacing.md,
      paddingRight: theme.spacing.md,
      marginBottom: rem(30),
    },

    controls: {
      paddingLeft: theme.spacing.md,
      paddingRight: theme.spacing.md,
    },

    control: {
      height: rem(54),
      fontSize: theme.fontSizes.md,
    },

    testimonialCard: {
      backgroundColor: isDark ? theme.colors.dark[6] : theme.colors.gray[0],
      padding: theme.spacing.xl,
    },

    footer: {
      marginTop: rem(120),
      borderTop: `${rem(1)} solid ${
        isDark ? theme.colors.dark[5] : theme.colors.gray[2]
      }`,
    },

    footerInner: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      paddingTop: theme.spacing.xl,
      paddingBottom: theme.spacing.xl,
    },

    pricing: {
      backgroundColor: isDark ? theme.colors.dark[7] : theme.white,
      marginTop: rem(100),
    },

    pricingTitle: {
      fontSize: rem(34),
      fontWeight: 900,
      marginBottom: rem(50),
    },

    pricingCard: {
      backgroundColor: isDark ? theme.colors.dark[6] : theme.white,
      border: `${rem(1)} solid ${
        isDark ? theme.colors.dark[5] : theme.colors.gray[1]
      }`,
    },

    pricingCardActive: {
      borderColor: theme.colors[theme.primaryColor][5],
    },

    pricingHeader: {
      padding: `${theme.spacing.lg} ${theme.spacing.xl}`,
      borderBottom: `${rem(1)} solid ${
        isDark ? theme.colors.dark[5] : theme.colors.gray[1]
      }`,
    },

    pricingFeatures: {
      padding: `${theme.spacing.lg} ${theme.spacing.xl}`,
    },

    pricingFooter: {
      padding: `${theme.spacing.lg} ${theme.spacing.xl}`,
      borderTop: `${rem(1)} solid ${
        isDark ? theme.colors.dark[5] : theme.colors.gray[1]
      }`,
    },
  };

  const features = [
    {
      icon: IconMap,
      title: "Smart Territory Mapping",
      description:
        "Automatically divide your canvassing territory using advanced algorithms for optimal coverage and team distribution.",
    },
    {
      icon: IconUsers,
      title: "Team Management",
      description:
        "Coordinate volunteers and staff with real-time tracking, communication tools, and performance analytics.",
    },
    {
      icon: IconDeviceMobile,
      title: "Mobile-First Design",
      description:
        "Seamless experience across all devices with offline capabilities for areas with limited connectivity.",
    },
    {
      icon: IconChartBar,
      title: "Data Analytics",
      description:
        "Powerful insights and visualization tools to track campaign progress, voter sentiment, and team effectiveness.",
    },
  ];

  const testimonials = [
    {
      quote:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Adipisci, ratione? Lorem ipsum dolor sit amet consectetur adipisicing elit. Quo, libero corporis laudantium, ad assumenda expedita quos ea porro iste a rerum sequi. Architecto, ab rerum sint vero delectus beatae sunt.",
      author: "John Doe",
      role: "Campaign ",
    },
    {
      quote:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Adipisci, ratione? Lorem ipsum dolor sit amet consectetur adipisicing elit. Quo, libero corporis laudantium, ad assumenda expedita quos ea porro iste a rerum sequi. Architecto, ab rerum sint vero delectus beatae sunt.",
      author: "Jane Doe",
      role: "Field Director",
    },
  ];

  const pricingPlans = [
    {
      title: "Starter",
      price: "$50.0",
      period: "per month",
      description: "Perfect for small campaigns and organizations",
      features: [
        "Up to 5 team members",
        "Basic territory mapping",
        "Standard data analytics",
        "Email support",
      ],
      cta: "Get Started",
      active: false,
    },
    {
      title: "Professional",
      price: "$100.0",
      period: "per month",
      description: "For growing campaigns with advanced needs",
      features: [
        "Up to 20 team members",
        "Advanced territory optimization",
        "Real-time team coordination",
        "Enhanced data analytics",
        "Priority support",
      ],
      cta: "Try Professional",
      active: true,
    },
    {
      title: "Enterprise",
      price: "Custom",
      period: "",
      description: "Tailored solutions for large-scale operations",
      features: [
        "Unlimited team members",
        "Custom integrations",
        "Dedicated account manager",
        "Advanced security features",
        "24/7 premium support",
      ],
      cta: "Contact Us",
      active: false,
    },
  ];

  return (
    <AppShell
      header={{
        height: 70,
      }}
    >
      <AppShell.Header>
        <Header />
      </AppShell.Header>

      <AppShell.Main>
        <Container size="xl">
          {/* ----------------------- */}
          {/*  Hero Section           */}
          {/* ----------------------- */}
          <Box py={rem(80)}>
            <Card
              bg={isDark ? theme.colors.dark[6] : theme.colors.gray[0]}
              p={rem(60)}
              style={{
                position: "relative",
                overflow: "hidden",
                borderColor: isDark
                  ? theme.colors.dark[5]
                  : theme.colors.gray[1],
              }}
              withBorder
            >
              <Box style={{ relative: "relative", zIndex: 1 }}>
                <Title style={styles.title}>
                  <span style={styles.highlight}>Transform</span>
                  Canvassing Operations with Data-Driven Tools
                </Title>

                <Text style={styles.description} size="xl">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Adipisci, ratione? Lorem ipsum dolor sit amet consectetur
                  adipisicing elit. Quo, libero corporis laudantium, ad
                  assumenda expedita quos ea porro iste a rerum sequi.
                  Architecto, ab rerum sint vero delectus beatae sunt.
                </Text>

                <Group style={styles.controls}>
                  <Button
                    size="xl"
                    rightSection={<IconArrowRight size={20} />}
                    style={styles.control}
                  >
                    Get Started
                  </Button>

                  <Button size="xl" variant="outline" style={styles.control}>
                    Watch Demo
                  </Button>
                </Group>
              </Box>
            </Card>
          </Box>
          {/* ----------------------- */}
          {/*  Hero Section           */}
          {/* ----------------------- */}

          {/* ----------------------- */}
          {/*  Featured Section       */}
          {/* ----------------------- */}
          <Container mt={{ base: "md", sm: "xl", md: "xl" }} size="xl">
            <Title fw={800} ta="center" mb={50} fz={rem(40)}>
              Built For Modern <span style={styles.highlight}>Campaigns</span>
            </Title>

            <SimpleGrid
              cols={{ base: 1, sm: 2 }}
              spacing={{ base: "md", sm: "xl" }}
            >
              {features.map((feature, index) => (
                <Card
                  key={index}
                  shadow="sm"
                  padding="xl"
                  withBorder
                  style={{
                    borderColor: isDark
                      ? theme.colors.dark[5]
                      : theme.colors.gray[1],
                  }}
                >
                  <Card.Section p="lg">
                    <Group gap="md">
                      <ThemeIcon
                        size={56}
                        radius="md"
                        variant="light"
                        color="blue"
                      >
                        <feature.icon size={34} stroke={1.5} />
                      </ThemeIcon>
                      <Text size="xl" fw={600} lh={1.3}>
                        {feature.title}
                      </Text>
                    </Group>
                  </Card.Section>

                  <Text size="sm" c="dimmed" lh={1.6}>
                    {feature.description}
                  </Text>
                </Card>
              ))}
            </SimpleGrid>
          </Container>
          {/* ----------------------- */}
          {/*  Featured Section       */}
          {/* ----------------------- */}

          {/* ----------------------- */}
          {/*  Testimonials Section   */}
          {/* ----------------------- */}
          <Container mt={100} size="xl">
            <Title fw={800} ta="center" mb={50} fz={rem(40)}>
              Trusted by <span style={styles.highlight}>Leading Campaigns</span>
            </Title>

            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing={30}>
              {testimonials.map((testimonial, index) => (
                <Card
                  key={index}
                  shadow="sm"
                  withBorder
                  p="xl"
                  style={{
                    ...styles.testimonialCard,
                    borderColor: isDark
                      ? theme.colors.dark[5]
                      : theme.colors.gray[1],
                  }}
                >
                  <Text size="lg" fs="italic" mb="md">
                    "{testimonial.quote}"
                  </Text>
                  <Group>
                    <div>
                      <Text fw={500}>{testimonial.author}</Text>
                      <Text size="xs" c="dimmed">
                        {testimonial.role}
                      </Text>
                    </div>
                  </Group>
                </Card>
              ))}
            </SimpleGrid>
          </Container>
          {/* ----------------------- */}
          {/*  Testimonials Section   */}
          {/* ----------------------- */}

          {/* ----------------------- */}
          {/*  Pricing Section        */}
          {/* ----------------------- */}
          <Container size="lg" py="xl" style={styles.pricing}>
            <Title
              fw={800}
              ta="center"
              style={styles.pricingTitle}
              fz={rem(40)}
            >
              <span style={styles.highlight}>Pricing</span>Plans
            </Title>

            <SimpleGrid cols={{ base: 1, sm: 3 }} spacing={30}>
              {pricingPlans.map((plan, index) => (
                <Card
                  key={index}
                  shadow="md"
                  withBorder
                  style={{
                    ...styles.pricingCard,
                    ...(plan.active ? styles.pricingCardActive : {}),
                  }}
                >
                  <div style={styles.pricingHeader}>
                    <Text fw={700} size="xl">
                      {plan.title}
                    </Text>
                    <Group gap={5} mt="xs">
                      <Text fw={700} size="xl">
                        {plan.price}
                      </Text>
                      <Text size="sm" c="dimmed">
                        {plan.period}
                      </Text>
                    </Group>
                    <Text size="sm" c="dimmed" mt="xs">
                      {plan.description}
                    </Text>
                  </div>

                  <div style={styles.pricingFeatures}>
                    <List
                      spacing="sm"
                      size="sm"
                      icon={
                        <ThemeIcon
                          color={plan.active ? "blue" : "gray"}
                          size={20}
                          radius="xl"
                        >
                          <IconCheck size={12} />
                        </ThemeIcon>
                      }
                    >
                      {plan.features.map((feature, featureIndex) => (
                        <List.Item key={featureIndex}>{feature}</List.Item>
                      ))}
                    </List>
                  </div>

                  <div style={styles.pricingFooter}>
                    <Button
                      fullWidth
                      variant={plan.active ? "filled" : "outline"}
                    >
                      {plan.cta}
                    </Button>
                  </div>
                </Card>
              ))}
            </SimpleGrid>
          </Container>
          {/* ----------------------- */}
          {/*  Pricing Section        */}
          {/* ----------------------- */}

          {/* ----------------------- */}
          {/*  CTA Section            */}
          {/* ----------------------- */}
          <Container mt={100} mb={30} size="xl">
            <Card
              withBorder
              p={40}
              style={{
                backgroundColor: `${
                  isDark
                    ? theme.colors.dark[6]
                    : theme.colors[theme.primaryColor][0]
                }`,
                borderColor: isDark
                  ? theme.colors.dark[5]
                  : theme.colors.gray[1],
              }}
            >
              <Grid>
                <Grid.Col span={{ base: 12, md: 8 }}>
                  <Title size={28} mb="xs">
                    Ready to revolutionize your canvassing operation?
                  </Title>
                  <Text size="lg">
                    Join thousands of campaigns using CanvassingApp to reach
                    more voters and drive better results.
                  </Text>
                </Grid.Col>
                <Grid.Col
                  span={{ base: 12, md: 4 }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                  }}
                >
                  <Button size="xl" fz="md">
                    Start Free Trial
                  </Button>
                </Grid.Col>
              </Grid>
            </Card>
          </Container>
          {/* ----------------------- */}
          {/*  CTA Section            */}
          {/* ----------------------- */}
        </Container>
        {/* ----------------------- */}
        {/*  Footer Section         */}
        {/* ----------------------- */}
        <Footer />
      </AppShell.Main>
    </AppShell>
  );
}
