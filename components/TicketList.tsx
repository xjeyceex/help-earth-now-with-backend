import { dummyTickets } from "@/dummyTickets";
import { useUserStore } from "@/stores/userStore";
import {
  Badge,
  Button,
  Card,
  Container,
  Flex,
  Select,
  Table,
  Title,
} from "@mantine/core";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const getStatusColor = (status: string) => {
  switch (status) {
    case "PENDING":
      return "yellow";
    case "APPROVED":
      return "green";
    case "IN PROGRESS":
      return "blue";
    case "COMPLETED":
      return "teal";
    case "REJECTED":
      return "red";
    case "ON HOLD":
      return "orange";
    default:
      return "gray";
  }
};

const TicketList = () => {
  const { user } = useUserStore();
  const [filter, setFilter] = useState<string>("ALL");
  const router = useRouter();

  if (!user) {
    return (
      <Container size="md" py="xl">
        <Title ta="center">Loading Tickets...</Title>
      </Container>
    );
  }

  // Define available filters based on user role
  const filterOptions =
    user.user_role === "CANVASSER"
      ? [
          { value: "ALL", label: "My Tickets" },
          { value: "PENDING", label: "Pending" },
          { value: "APPROVED", label: "Approved" },
        ]
      : [
          { value: "ALL", label: "All Tickets" },
          { value: "MINE", label: "Assigned to Me" },
          { value: "PENDING", label: "Pending" },
          { value: "APPROVED", label: "Approved" },
        ];

  const filteredTickets = dummyTickets.filter((ticket) => {
    if (
      user.user_role === "CANVASSER" &&
      ticket.ticket_assigned_to !== user.user_full_name
    ) {
      return false;
    }
    if (
      filter === "MINE" &&
      ticket.ticket_assigned_to !== user.user_full_name
    ) {
      return false;
    }
    if (filter === "PENDING" && ticket.ticket_status !== "PENDING") {
      return false;
    }
    if (filter === "APPROVED" && ticket.ticket_status !== "APPROVED") {
      return false;
    }
    return true;
  });

  return (
    <Container size="md" py="xl">
      <Card shadow="sm" padding="lg" mt="lg" radius="md" withBorder>
        <Flex justify="space-between" align="center">
          <Title size="h3">Ticket List</Title>
          <Flex gap="sm">
            <Select
              value={filter}
              onChange={(value) => setFilter(value || "ALL")}
              data={filterOptions}
              placeholder="Filter tickets"
            />
            <Button onClick={() => setFilter("ALL")}>Reset</Button>
            {user.user_role === "CANVASSER" && (
              <Button onClick={() => router.push("/tickets/create-ticket")}>
                Create Ticket
              </Button>
            )}
          </Flex>
        </Flex>

        <Table mt="md" striped highlightOnHover>
          <thead>
            <tr>
              <th style={{ textAlign: "left" }}>Ticket ID</th>
              <th style={{ textAlign: "left" }}>Description</th>
              <th style={{ textAlign: "left" }}>Assigned To</th>
              <th style={{ textAlign: "left" }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredTickets.map((ticket) => (
              <tr key={ticket.ticket_id}>
                <td>
                  <Link
                    href={`/tickets/${ticket.ticket_id}`}
                    style={{
                      textDecoration: "none",
                      color: "inherit",
                      transition:
                        "color 0.2s ease-in-out, text-decoration 0.2s ease-in-out",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "blue";
                      e.currentTarget.style.textDecoration = "underline";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "inherit";
                      e.currentTarget.style.textDecoration = "none";
                    }}
                  >
                    {ticket.ticket_id}
                  </Link>
                </td>
                <td>{ticket.ticket_item_description}</td>
                <td>{ticket.ticket_assigned_to}</td>
                <td>
                  <Badge color={getStatusColor(ticket.ticket_status)}>
                    {ticket.ticket_status}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>
    </Container>
  );
};

export default TicketList;
