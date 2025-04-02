"use client";

import {
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
  IconUsers,
} from "@tabler/icons-react";

export default function HomePage() {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();

  const styles = {
    title: {
      fontWeight: 800,
      fontSize: rem(40),
      letterSpacing: -1,
      paddingLeft: theme.spacing.md,
      paddingRight: theme.spacing.md,
      color: colorScheme === "dark" ? theme.white : theme.black,
      marginBottom: theme.spacing.xs,
    },

    highlight: {
      color: theme.colors[theme.primaryColor][colorScheme === "dark" ? 4 : 6],
      fontWeight: 800,
      letterSpacing: -1,
      paddingRight: theme.spacing.sm,
    },

    description: {
      color:
        colorScheme === "dark" ? theme.colors.dark[1] : theme.colors.gray[7],
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
      backgroundColor:
        colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[0],
      padding: theme.spacing.xl,
    },

    footer: {
      marginTop: rem(120),
      borderTop: `${rem(1)} solid ${
        colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[2]
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
      backgroundColor:
        colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
      marginTop: rem(100),
    },

    pricingTitle: {
      fontSize: rem(34),
      fontWeight: 900,
      marginBottom: rem(50),
    },

    pricingCard: {
      backgroundColor:
        colorScheme === "dark" ? theme.colors.dark[6] : theme.white,
      borderWidth: rem(1),
      borderStyle: "solid",
      borderColor:
        colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[1],
    },

    pricingCardActive: {
      borderWidth: rem(1),
      borderStyle: "solid",
      borderColor: theme.colors[theme.primaryColor][5],
    },

    pricingHeader: {
      padding: `${theme.spacing.lg} ${theme.spacing.xl}`,
      borderBottom: `${rem(1)} solid ${
        colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[1]
      }`,
    },

    pricingFeatures: {
      padding: `${theme.spacing.lg} ${theme.spacing.xl}`,
    },

    pricingFooter: {
      padding: `${theme.spacing.lg} ${theme.spacing.xl}`,
      borderTop: `${rem(1)} solid ${
        colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[1]
      }`,
    },
  };

  const features = [
    {
      icon: IconUsers,
      title: "Centralized Purchase Requests",
      description:
        "Streamline purchase requests with real-time tracking and automated status updates, ensuring transparency at every step.",
    },
    {
      icon: IconDeviceMobile,
      title: "Efficient Quote Comparison",
      description:
        "Easily compare supplier quotes with detailed cost breakdowns, historical pricing data, and AI-powered recommendations for smarter decisions.",
    },
    {
      icon: IconCheck,
      title: "Seamless Approval Workflow",
      description:
        "Speed up approvals with role-based access, automated notifications, and one-click approvals to keep purchases moving forward efficiently.",
    },
    {
      icon: IconChartBar,
      title: "Data-Driven Procurement Insights",
      description:
        "Leverage analytics to track spending trends, identify cost-saving opportunities, and improve purchasing efficiency with real-time data.",
    },
  ];

  const testimonials = [
    {
      quote:
        "This platform has completely streamlined our procurement process! The ability to compare supplier quotes and track purchases in real-time has saved us time and money.",
      author: "Macario Batungbacal",
      role: "Procurement Manager, Global Supplies Inc.",
    },
    {
      quote:
        "Managing purchase requests used to be a hassle, but now everything is organized in one place. The automated tracking and approvals make our workflow much smoother.",
      author: "Junmar Balarbar",
      role: "Operations Lead, FreshMart Wholesale",
    },
  ];

  const pricingPlans = [
    {
      title: "Starter",
      price: "$49",
      period: "per month",
      description: "Best for small campaigns or grassroots initiatives.",
      features: [
        "Up to 5 campaign team members",
        "Basic territory mapping tools",
        "Standard voter data tracking",
        "Email support",
      ],
      cta: "Get Started",
      active: false,
    },
    {
      title: "Professional",
      price: "$99",
      period: "per month",
      description: "For growing campaigns that need real-time insights.",
      features: [
        "Up to 25 team members",
        "AI-powered territory optimization",
        "Real-time volunteer tracking",
        "Advanced voter sentiment analytics",
        "Priority support",
      ],
      cta: "Upgrade Now",
      active: true,
    },
    {
      title: "Enterprise",
      price: "Custom",
      period: "",
      description: "Tailored solutions for large-scale political operations.",
      features: [
        "Unlimited team members & districts",
        "Custom voter data integrations",
        "Dedicated success manager",
        "Enterprise-grade security & compliance",
        "24/7 premium support",
      ],
      cta: "Request a Demo",
      active: false,
    },
  ];

  return (
    <main>
      <Container size="xl">
        {/* ----------------------- */}
        {/*  Hero Section           */}
        {/* ----------------------- */}
        <Box py={rem(80)}>
          <Card
            bg={
              colorScheme === "dark"
                ? theme.colors.dark[6]
                : theme.colors.gray[0]
            }
            p={rem(60)}
            style={{
              position: "relative",
              overflow: "hidden",
              borderColor:
                colorScheme === "dark"
                  ? theme.colors.dark[5]
                  : theme.colors.gray[1],
            }}
            withBorder
          >
            <Box style={{ position: "relative", zIndex: 1 }}>
              <Title style={styles.title}>
                <span style={styles.highlight}>Revolutionize</span>
                Canvassing Operations with Data-Driven Insights
              </Title>

              <Text style={styles.description} size="xl">
                Simplify procurement with a seamless, all-in-one platform for
                sourcing, comparing supplier quotes, and managing approvals.
                Boost efficiency, enhance transparency, and make smarter
                decisions—all in one place.
              </Text>

              <Group style={styles.controls}>
                <Button
                  size="xl"
                  rightSection={<IconArrowRight size={20} />}
                  style={styles.control}
                >
                  Get Started Today
                </Button>

                <Button size="xl" variant="outline" style={styles.control}>
                  Watch the Demo
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
            Built for <span style={styles.highlight}>Modern Campaigns</span>
          </Title>

          <SimpleGrid
            cols={{ base: 1, sm: 2 }}
            spacing={{ base: "md", sm: "xl" }}
          >
            {features.map((feature, index) => (
              <Card
                key={index}
                shadow="md"
                padding="xl"
                withBorder
                radius="md"
                style={{
                  borderColor:
                    colorScheme === "dark"
                      ? theme.colors.dark[4]
                      : theme.colors.gray[2],
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: theme.shadows.md,
                  },
                }}
              >
                <Card.Section p="lg">
                  <Group gap="md">
                    <ThemeIcon
                      size={56}
                      radius="lg"
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

                <Text size="md" c="dimmed" lh={1.6} mt="sm">
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
                  borderColor:
                    colorScheme === "dark"
                      ? theme.colors.dark[5]
                      : theme.colors.gray[1],
                }}
              >
                <Text size="lg" fs="italic" mb="md">
                  {testimonial.quote}
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
          <Title fw={800} ta="center" style={styles.pricingTitle} fz={rem(40)}>
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
                colorScheme === "dark"
                  ? theme.colors.dark[6]
                  : theme.colors[theme.primaryColor][0]
              }`,
              borderColor:
                colorScheme === "dark"
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
                  Join thousands of campaigns using CanvassingApp to reach more
                  voters and drive better results.
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
    </main>
  );
}
