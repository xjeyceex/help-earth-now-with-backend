"use client";

import { dummyTickets } from "@/dummyTickets";
import { useUserStore } from "@/stores/userStore";
import {
  Badge,
  Button,
  Card,
  Container,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import Link from "next/link";
import { useParams } from "next/navigation";

const TicketDetailsPage = () => {
  const { ticket_id } = useParams();
  const { user } = useUserStore();

  const ticket = dummyTickets.find((t) => String(t.ticket_id) === ticket_id);

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
  const isAssigned = ticket.ticket_assigned_to === user?.user_full_name;

  // Admins can view all tickets, but regular users can only view assigned ones
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
          <div>
            <strong>Status:</strong>{" "}
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
            <strong>Created By:</strong> {ticket.ticket_created_by}
          </Text>
          <Text size="lg">
            <strong>Assigned To:</strong> {ticket.ticket_assigned_to}
          </Text>
          <Text size="lg">
            <strong>Date Created:</strong> {ticket.ticket_date_created}
          </Text>
          <Text size="lg">
            <strong>Last Updated:</strong> {ticket.ticket_last_updated}
          </Text>
          <Link href="/dashboard">
            <Button mt="md">Back to Dashboard</Button>
          </Link>
        </Stack>
      </Card>
    </Container>
  );
};

export default TicketDetailsPage;
