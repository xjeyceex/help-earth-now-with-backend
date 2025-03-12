"use client";

import { dummyTickets } from "@/dummyTickets";
import { useUserStore } from "@/stores/userStore";
import {
  Badge,
  Button,
  Card,
  Container,
  Grid,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import Link from "next/link";

// Function to filter tickets based on user role
const filterUserTickets = (userFullName: string, isAdmin: boolean) => {
  return isAdmin
    ? dummyTickets // Admin sees all tickets
    : dummyTickets.filter(
        (ticket) =>
          ticket.ticket_created_by === userFullName ||
          ticket.ticket_assigned_to === userFullName
      );
};

// Function to count tickets by status
const countUserTicketsByStatus = (
  tickets: typeof dummyTickets,
  status: string
) => tickets.filter((ticket) => ticket.ticket_status === status).length;

const DashboardPage = () => {
  const { user } = useUserStore(); // Get logged-in user

  const userFullName = user?.user_full_name ?? "";
  const isAdmin = user?.user_role === "ADMIN"; // Check if user is admin

  // Get the correct ticket list based on user role
  const userTickets = filterUserTickets(userFullName, isAdmin);

  return (
    <>
      <Container size="lg" py="xl">
        <Title ta="center" mb="lg">
          Dashboard
        </Title>

        {/* Stats Section */}
        <Grid gutter="md">
          <Grid.Col span={{ base: 12, sm: 4 }}>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Text size="lg" fw={500}>
                Pending Tickets
              </Text>
              <Badge color="yellow" size="xl" mt="md">
                {countUserTicketsByStatus(userTickets, "PENDING")}
              </Badge>
            </Card>
          </Grid.Col>

          <Grid.Col span={{ base: 12, sm: 4 }}>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Text size="lg" fw={500}>
                In Progress
              </Text>
              <Badge color="blue" size="xl" mt="md">
                {countUserTicketsByStatus(userTickets, "IN PROGRESS")}
              </Badge>
            </Card>
          </Grid.Col>

          <Grid.Col span={{ base: 12, sm: 4 }}>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Text size="lg" fw={500}>
                Completed Tickets
              </Text>
              <Badge color="green" size="xl" mt="md">
                {countUserTicketsByStatus(userTickets, "COMPLETED")}
              </Badge>
            </Card>
          </Grid.Col>
        </Grid>

        {/* Recent Tickets Section */}
        <Title order={2} mt="xl">
          {isAdmin ? "Recent Tickets" : "Your Recent Tickets"}
        </Title>
        <Stack mt="md">
          {userTickets.slice(0, 5).map((ticket) => (
            <Card key={ticket.ticket_id} shadow="sm" padding="md" withBorder>
              <Text size="md" fw={500}>
                {ticket.ticket_item_description}
              </Text>
              <Badge
                color={
                  ticket.ticket_status === "PENDING"
                    ? "yellow"
                    : ticket.ticket_status === "IN PROGRESS"
                    ? "blue"
                    : ticket.ticket_status === "COMPLETED"
                    ? "green"
                    : "gray"
                }
                mt="sm"
              >
                {ticket.ticket_status}
              </Badge>
              <Link href={`/tickets/${ticket.ticket_id}`}>
                <Button mt="md" size="xs" variant="light">
                  View Ticket
                </Button>
              </Link>
            </Card>
          ))}
        </Stack>

        {/* Quick Actions */}
        <Stack mt="xl" align="center">
          <Link href="/tickets">
            <Button size="md">View All Tickets</Button>
          </Link>
        </Stack>
      </Container>
    </>
  );
};

export default DashboardPage;
