"use client";

import { getTickets } from "@/actions/get";
import { useUserStore } from "@/stores/userStore";
import { TicketType } from "@/utils/types";
import {
  Badge,
  Button,
  Card,
  Container,
  Loader,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const TicketDetailsPage = () => {
  const { ticket_id } = useParams() as { ticket_id?: string };
  const { user } = useUserStore();

  const [ticket, setTicket] = useState<TicketType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTicket = async () => {
      setLoading(true);
      const tickets = await getTickets({ ticket_id });

      if (Array.isArray(tickets) && tickets.length > 0) {
        setTicket(tickets[0]);
      }

      setLoading(false);
    };

    fetchTicket();
  }, [ticket_id]);

  if (loading) {
    return (
      <Container size="sm" py="xl">
        <Loader size="lg" />
      </Container>
    );
  }

  if (!ticket) {
    return (
      <Container size="sm" py="xl">
        <Title>Ticket Not Found</Title>
        <Text>Sorry, the ticket does not exist.</Text>
        <Link href="/dashboard">
          <Button mt="md">Back to Dashboard</Button>
        </Link>
      </Container>
    );
  }
  const isAdmin = user?.user_role === "ADMIN";
  const isAssigned = ticket.shared_users?.some(
    (u) => u.user_id === user?.user_id,
  );

  if (!isAdmin && !isAssigned) {
    return (
      <Container size="sm" py="xl">
        <Title>Unauthorized Access</Title>
        <Text>You do not have permission to view this ticket.</Text>
        <Link href="/dashboard">
          <Button mt="md">Back to Dashboard</Button>
        </Link>
      </Container>
    );
  }

  return (
    <Container size="sm" py="xl">
      <Title ta="center">Ticket Details</Title>
      <Card shadow="sm" padding="lg" mt="lg" radius="md" withBorder>
        <Stack>
          <div>
            <strong>Ticket Status:</strong>{" "}
            <Badge
              color={
                ticket.ticket_status === "PENDING"
                  ? "yellow"
                  : ticket.ticket_status === "APPROVED"
                    ? "green"
                    : ticket.ticket_status === "IN PROGRESS"
                      ? "blue"
                      : ticket.ticket_status === "COMPLETED"
                        ? "teal"
                        : ticket.ticket_status === "REJECTED"
                          ? "red"
                          : "gray"
              }
            >
              {ticket.ticket_status}
            </Badge>
          </div>
          <Text size="lg">
            <strong>Ticket ID:</strong> {ticket.ticket_id}
          </Text>
          <Text size="lg">
            <strong>Item Description:</strong> {ticket.ticket_item_description}
          </Text>
          <Text size="lg">
            <strong>Quantity:</strong> {ticket.ticket_quantity}
          </Text>
          <Text size="lg">
            <strong>Specifications:</strong> {ticket.ticket_specifications}
          </Text>
          <Text size="lg">
            <strong>Reviewer:</strong> {ticket.reviewer}
          </Text>
          <div>
            <strong>Approval Status:</strong>{" "}
            <Badge
              color={
                ticket.approval_status === "PENDING"
                  ? "yellow"
                  : ticket.approval_status === "APPROVED"
                    ? "green"
                    : ticket.approval_status === "REJECTED"
                      ? "red"
                      : "gray"
              }
            >
              {ticket.approval_status}
            </Badge>
          </div>

          {/* Shared With Section (Display Only) */}
          <div>
            <strong>Shared With:</strong>
            {ticket.shared_users.length > 0 ? (
              <ul>
                {ticket.shared_users.map((u) => (
                  <li key={u.user_id}>{u.user_full_name}</li>
                ))}
              </ul>
            ) : (
              <Text color="dimmed">Not shared with anyone yet.</Text>
            )}
          </div>

          <Link href="/dashboard">
            <Button mt="md">Back to Dashboard</Button>
          </Link>
        </Stack>
      </Card>
    </Container>
  );
};

export default TicketDetailsPage;
