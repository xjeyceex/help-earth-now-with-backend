import { getAllMyTickets } from "@/actions/get";
import { useUserStore } from "@/stores/userStore";
import { MyTicketType } from "@/utils/types";
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

  // ✅ Fetch when user is available
  useEffect(() => {
    fetchTickets();
  }, [user?.user_id]);

  // ✅ Filter Options based on User Role
  const filterOptions =
    user?.user_role === "CANVASSER"
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

  // ✅ Filter Tickets based on User Role and Status
  const filteredTickets = tickets.filter((ticket) => {
    const isCanvasser = user?.user_role === "CANVASSER";

    // Check if user is included in `shared_users`
    const isSharedWithUser = ticket.shared_users?.some(
      (sharedUser) => sharedUser.user_id === user?.user_id
    );

    // For Canvasser, only show tickets shared with them
    if (isCanvasser && !isSharedWithUser) {
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

  // ✅ Loading State
  if (!user || loading) {
    return (
      <Container size="md" py="xl">
        <Title ta="center">
          {loading ? "Loading Tickets..." : "No User Found"}
        </Title>
      </Container>
    );
  }

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

        {/* ✅ Show Tickets */}
        {filteredTickets.length > 0 ? (
          <Table mt="md" striped highlightOnHover>
            <thead>
              <tr>
                <th style={{ textAlign: "left", padding: "12px" }}>
                  Ticket ID
                </th>
                <th style={{ textAlign: "left", padding: "12px" }}>
                  Description
                </th>
                <th style={{ textAlign: "left", padding: "12px" }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredTickets.map((ticket) => (
                <tr key={ticket.ticket_id}>
                  <td>
                    <Link href={`/tickets/${ticket.ticket_id}`}>
                      <Button variant="subtle">{ticket.ticket_id}</Button>
                    </Link>
                  </td>
                  <td>{ticket.ticket_item_description}</td>
                  <td>
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
