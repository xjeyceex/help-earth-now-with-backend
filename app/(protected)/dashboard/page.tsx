"use client";

import { useUserStore } from "@/stores/userStore";
import {
  Badge,
  Button,
  Card,
  Container,
  Flex,
  Stack,
  Table,
  Text,
  Title,
} from "@mantine/core";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Dummy ticket data
const dummyTickets = [
  { ticket_id: 1, title: "Request for Laptop Quotes", status: "PENDING" },
  { ticket_id: 2, title: "Compare Office Chair Prices", status: "APPROVED" },
  { ticket_id: 3, title: "Find Best Supplier for Monitors", status: "PENDING" },
  { ticket_id: 4, title: "Bulk Order for Keyboards", status: "APPROVED" },
];

const DashboardPage = () => {
  const { user, setUser } = useUserStore();
  const router = useRouter();

  const handleLogout = () => {
    setUser(null);
    router.push("/login");
  };

  return (
    <Container size="md" py="xl">
      <Title ta="center">Welcome to the Dashboard</Title>
      {user ? (
        <Card shadow="sm" padding="lg" mt="lg" radius="md" withBorder>
          <Stack>
            <Text size="md">
              <strong>Name:</strong> {user.user_full_name}
            </Text>
            <Text size="md">
              <strong>Email:</strong> {user.user_email}
            </Text>
            <Text size="md">
              <strong>User Role:</strong> {user.user_role}
            </Text>
            <Flex justify="center" mt="md">
              <Button color="red" variant="filled" onClick={handleLogout}>
                Logout
              </Button>
            </Flex>
          </Stack>
        </Card>
      ) : (
        <Text ta="center" size="md" c="dimmed">
          Loading user data...
        </Text>
      )}

      {/* Ticket List */}
      <Card shadow="sm" padding="lg" mt="lg" radius="md" withBorder>
        <Title size="h3" ta="center">
          Ticket List
        </Title>
        <Table mt="md" striped highlightOnHover>
          <thead>
            <tr>
              <th style={{ textAlign: "left" }}>Ticket ID</th>
              <th style={{ textAlign: "left" }}>Title</th>
              <th style={{ textAlign: "left" }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {dummyTickets.map((ticket) => (
              <tr key={ticket.ticket_id}>
                <td>
                  <Link
                    href={`/tickets/${ticket.ticket_id}`}
                    style={{ textDecoration: "none", color: "blue" }}
                  >
                    {ticket.ticket_id}
                  </Link>
                </td>
                <td>{ticket.title}</td>
                <td>
                  <Badge
                    color={ticket.status === "PENDING" ? "yellow" : "green"}
                  >
                    {ticket.status}
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

export default DashboardPage;
