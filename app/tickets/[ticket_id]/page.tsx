"use client";

import { dummyTickets } from "@/dummyTickets";
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
  const ticket = dummyTickets.find((t) => t.ticket_id === Number(ticket_id));

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

  return (
    <Container size="sm" py="xl">
      <Title ta="center">Ticket Details</Title>
      <Card shadow="sm" padding="lg" mt="lg" radius="md" withBorder>
        <Stack>
          <Text size="lg">
            <strong>Ticket ID:</strong> {ticket.ticket_id}
          </Text>
          <Text size="lg">
            <strong>Title:</strong> {ticket.title}
          </Text>
          <div>
            {" "}
            {/* ✅ Changed from <Text> to <div> to avoid hydration issue */}
            <strong>Status:</strong>{" "}
            <Badge color={ticket.status === "PENDING" ? "yellow" : "green"}>
              {ticket.status}
            </Badge>
          </div>
          <Text size="lg">
            <strong>Description:</strong> {ticket.description}
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
