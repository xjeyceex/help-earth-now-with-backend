"use client";

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
import { useEffect, useState } from "react";

// Dummy ticket data
const dummyTickets = [
  {
    ticket_id: 1,
    title: "Request for Laptop Quotes",
    status: "PENDING",
    description: "Need 5 new laptops for the team.",
  },
  {
    ticket_id: 2,
    title: "Compare Office Chair Prices",
    status: "APPROVED",
    description: "Looking for ergonomic chairs.",
  },
  {
    ticket_id: 3,
    title: "Find Best Supplier for Monitors",
    status: "PENDING",
    description: "Searching for 27-inch monitors.",
  },
  {
    ticket_id: 4,
    title: "Bulk Order for Keyboards",
    status: "APPROVED",
    description: "Ordering mechanical keyboards.",
  },
];

const TicketDetailsPage = () => {
  const { ticket_id } = useParams();
  const [ticket, setTicket] = useState<null | (typeof dummyTickets)[0]>(null);

  useEffect(() => {
    if (ticket_id) {
      const foundTicket = dummyTickets.find(
        (t) => t.ticket_id === Number(ticket_id),
      );
      setTicket(foundTicket || null);
    }
  }, [ticket_id]);

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
          <Text size="lg">
            <strong>Status:</strong>{" "}
            <Badge color={ticket.status === "PENDING" ? "yellow" : "green"}>
              {ticket.status}
            </Badge>
          </Text>
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
