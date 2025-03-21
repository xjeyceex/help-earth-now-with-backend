"use client";

import { getAllMyTickets } from "@/actions/get";
import LoadingStateProtected from "@/components/LoadingStateProtected";
import { useUserStore } from "@/stores/userStore";
import { MyTicketType } from "@/utils/types";
import {
  Badge,
  Button,
  Card,
  Container,
  Divider,
  Flex,
  Select,
  Table,
  Text,
  Title,
} from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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
  const [tickets, setTickets] = useState<MyTicketType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  const fetchTickets = async () => {
    if (!user?.user_id) return;

    setLoading(true);

    const fetchedTickets = await getAllMyTickets({
      user_id: user.user_id,
    });

    setTickets(fetchedTickets);
    setLoading(false);
  };

  // Fetch when user is available
  useEffect(() => {
    fetchTickets();
  }, [user?.user_id]);

  // Filter Options based on User Role
  const filterOptions =
    user?.user_role === "PURCHASER"
      ? [
          { value: "ALL", label: "My Tickets" },
          { value: "PENDING", label: "Pending" },
          { value: "APPROVED", label: "Approved" },
        ]
      : [
          { value: "ALL", label: "All Tickets" },
          { value: "PENDING", label: "Pending" },
          { value: "APPROVED", label: "Approved" },
        ];

  // Filter Tickets based on User Role and Status
  const filteredTickets = tickets.filter((ticket) => {
    const isPurchaser = user?.user_role === "PURCHASER";

    // Check if user is included in `shared_users`
    const isSharedWithUser = ticket.shared_users?.some(
      (sharedUser) => sharedUser === user?.user_id
    );

    // Check if the user is the creator of the ticket
    const isTicketOwner = ticket.ticket_created_by === user?.user_id;

    // For Purchaser, show tickets shared with them or tickets they created
    if (isPurchaser && !(isSharedWithUser || isTicketOwner)) {
      return false;
    }

    // Filter by status
    if (filter === "PENDING" && ticket.ticket_status !== "PENDING") {
      return false;
    }
    if (filter === "APPROVED" && ticket.ticket_status !== "APPROVED") {
      return false;
    }

    return true;
  });

  if (!user || loading) {
    return <LoadingStateProtected />;
  }

  return (
    <Container size="md" py="xl">
      <Card shadow="sm" padding="lg" mt="lg" radius="md" withBorder>
        <Flex justify="center" align="center" mb="lg">
          <Title size="h3">Ticket List</Title>
        </Flex>

        {/* Center the filters and button */}
        <Flex justify="center" align="center" mb="lg">
          <Flex gap="sm" justify="center" align="center">
            <Select
              value={filter}
              onChange={(value) => setFilter(value || "ALL")}
              data={filterOptions}
              placeholder="Filter tickets"
            />
            <Button onClick={() => setFilter("ALL")}>Reset</Button>
            {user.user_role === "PURCHASER" && (
              <Button
                rightSection={<IconPlus size={20} />}
                onClick={() => router.push("/tickets/create-ticket")}
                variant="light"
              >
                Create New Ticket
              </Button>
            )}
          </Flex>
        </Flex>
        {/* ✅ Show Tickets */}
        {filteredTickets.length > 0 ? (
          <Table mt="md" striped highlightOnHover>
            <thead>
              <tr>
                <th
                  style={{
                    textAlign: "center",
                    padding: "12px",
                    width: "150px",
                  }}
                >
                  <Text size="sm" style={{ fontWeight: 500 }}>
                    Ticket ID
                  </Text>
                </th>
                <th style={{ textAlign: "center", padding: "12px" }}>
                  <Text size="sm" style={{ fontWeight: 500 }}>
                    Description
                  </Text>
                </th>
                <th style={{ textAlign: "center", padding: "12px" }}>
                  <Text size="sm" style={{ fontWeight: 500 }}>
                    Status
                  </Text>
                </th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td colSpan={3}>
                  <Divider my="xs" />
                </td>
              </tr>
              {filteredTickets.map((ticket) => (
                <tr key={ticket.ticket_id}>
                  <td
                    style={{
                      textAlign: "center",
                      padding: "12px",
                      width: "150px",
                    }}
                  >
                    <Link href={`/tickets/${ticket.ticket_id}`}>
                      <Button variant="subtle">{ticket.ticket_id}</Button>
                    </Link>
                  </td>
                  <td style={{ textAlign: "center", padding: "12px" }}>
                    <Text size="sm">{ticket.ticket_item_description}</Text>
                  </td>
                  <td style={{ textAlign: "center", padding: "12px" }}>
                    <Badge color={getStatusColor(ticket.ticket_status)}>
                      {ticket.ticket_status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <Title ta="center" mt="md">
            No Tickets Found
          </Title>
        )}
      </Card>
    </Container>
  );
};

export default TicketList;
