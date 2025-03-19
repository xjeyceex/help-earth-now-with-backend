"use client";

import { getDashboardTickets } from "@/actions/get";
import LoadingStateProtected from "@/components/LoadingStateProtected";
import { useUserStore } from "@/stores/userStore";
import { DashboardTicketType } from "@/utils/types";
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

const DashboardPage = () => {
  const { user } = useUserStore();
  const [tickets, setTickets] = useState<DashboardTicketType[]>([]);
  const [loading, setLoading] = useState(true);

  const isAdmin = user?.user_role === "ADMIN";

  const countUserTicketsByStatus = (
    tickets: DashboardTicketType[],
    statusType: "OPEN" | "COMPLETED",
  ) => {
    if (statusType === "OPEN") {
      return tickets.filter(
        (ticket) =>
          ticket.ticket_status === "FOR CANVASS" ||
          ticket.ticket_status === "IN PROGRESS",
      ).length;
    }

    if (statusType === "COMPLETED") {
      return tickets.filter((ticket) => ticket.ticket_status === "COMPLETED")
        .length;
    }

    return 0; // Fallback
  };

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true);

        const data = await getDashboardTickets(
          isAdmin ? undefined : user?.user_id,
        );

        setTickets(data ?? []);
      } catch (error) {
        console.error(" Unexpected error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [isAdmin, user?.user_id]);

  if (!user || loading) {
    return <LoadingStateProtected />;
  }

  return (
    <Container size="lg" py="xl">
      <Title ta="center" mb="lg">
        Dashboard
      </Title>

      {/* ✅ Status Count Section */}
      <Grid gutter="md">
        <Grid.Col span={{ base: 12, sm: 6 }}>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Text size="lg" fw={500}>
              Open Ticket
            </Text>
            <Badge color="blue" size="xl" mt="md">
              {countUserTicketsByStatus(tickets, "OPEN")}
            </Badge>
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, sm: 6 }}>
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

      {/* ✅ Recent Tickets Section */}
      <Title order={2} mt="xl">
        {user?.user_role === "ADMIN" && "Recent Tickets"}
        {user?.user_role === "PURCHASER" && "Your Open Tickets"}
        {user?.user_role === "REVIEWER" && "Tickets to Review"}
      </Title>

      {tickets.length === 0 ? (
        <Text>No tickets found.</Text>
      ) : (
        <Stack mt="md">
          {tickets.slice(0, 3).map((ticket) => (
            <Card key={ticket.ticket_id} shadow="sm" padding="md" withBorder>
              <Text size="md" fw={500}>
                {ticket.ticket_item_description}
              </Text>
              <Badge
                color={
                  ticket.ticket_status === "FOR CANVASS"
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
    </Container>
  );
};

export default DashboardPage;
