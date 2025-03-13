"use client";

import { getTickets } from "@/actions/get";
import { useUserStore } from "@/stores/userStore";
import { TicketType } from "@/utils/types";
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
import { useEffect, useState } from "react";

// Function to count tickets by status
const countUserTicketsByStatus = (tickets: TicketType[], status: string) =>
  tickets.filter((ticket) => ticket.ticket_status === status).length;

const DashboardPage = () => {
  const { user } = useUserStore(); // Get logged-in user
  const [tickets, setTickets] = useState<TicketType[]>([]);
  const [loading, setLoading] = useState(true);

  const userFullName = user?.user_full_name ?? "";
  const isAdmin = user?.user_role === "ADMIN"; // Check if user is admin

  // Fetch tickets when the component mounts
  useEffect(() => {
    const fetchTickets = async () => {
      setLoading(true);

      const filters = isAdmin ? {} : { shared_with: userFullName };
      const data = await getTickets(filters);

      // Ensure data is an array before setting state
      if (!Array.isArray(data)) {
        console.error("Error fetching tickets:", data.message);
        setLoading(false);
        return;
      }

      setTickets(data);
      setLoading(false);
    };

    fetchTickets();
  }, [isAdmin, userFullName]);

  return (
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
              {countUserTicketsByStatus(tickets, "FOR CANVASS")}
            </Badge>
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, sm: 4 }}>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Text size="lg" fw={500}>
              In Progress
            </Text>
            <Badge color="blue" size="xl" mt="md">
              {countUserTicketsByStatus(tickets, "IN PROGRESS")}
            </Badge>
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, sm: 4 }}>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Text size="lg" fw={500}>
              Completed Tickets
            </Text>
            <Badge color="green" size="xl" mt="md">
              {countUserTicketsByStatus(tickets, "COMPLETED")}
            </Badge>
          </Card>
        </Grid.Col>
      </Grid>

      {/* Recent Tickets Section */}
      <Title order={2} mt="xl">
        {isAdmin ? "Recent Tickets" : "Your Recent Tickets"}
      </Title>

      {loading ? (
        <Text>Loading tickets...</Text>
      ) : (
        <Stack mt="md">
          {tickets.slice(0, 5).map((ticket) => (
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
      )}

      {/* Quick Actions */}
      <Stack mt="xl" align="center">
        <Link href="/tickets">
          <Button size="md">View All Tickets</Button>
        </Link>
      </Stack>
    </Container>
  );
};

export default DashboardPage;
