"use client";

import { getAllUsers, getTicketDetails } from "@/actions/get";
import { shareTicket } from "@/actions/post";
import { useUserStore } from "@/stores/userStore";
import { TicketDetailsType } from "@/utils/types";
import {
  Badge,
  Button,
  Card,
  Container,
  Loader,
  Modal,
  Select,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const TicketDetailsPage = () => {
  const { ticket_id } = useParams() as { ticket_id: string };
  const { user } = useUserStore();

  const [ticket, setTicket] = useState<TicketDetailsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [sharedUser, setSharedUser] = useState<string | null>(null);
  const [isSharing, setIsSharing] = useState(false);
  const [allUsers, setAllUsers] = useState<{ value: string; label: string }[]>(
    []
  );

  const handleShareTicket = async () => {
    if (!sharedUser || !ticket_id) return;
    await shareTicket(ticket_id, sharedUser);
    setIsSharing(false);
    fetchTicketDetails();
  };

  // Fetch ticket details
  const fetchTicketDetails = async () => {
    if (!ticket_id) return;
    const tickets = await getTicketDetails(ticket_id);
    if (Array.isArray(tickets) && tickets.length > 0) {
      setTicket(tickets[0]);
    }
    setLoading(false);
  };
  // Fetch all users for the select dropdown
  const fetchUsers = async () => {
    const users = await getAllUsers(ticket_id);

    // Type Guard to check if it's an error
    if ("error" in users) {
      console.error(users.message);
      return;
    }

    // Directly set users since they're already formatted
    setAllUsers(users);
  };

  useEffect(() => {
    fetchTicketDetails();
    fetchUsers(); // No need to call fetchUsers API anymore
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
    (u) => u.user_id === user?.user_id
  );
  const isReviewer = ticket.reviewers?.some(
    (r) => r.reviewer_id === user?.user_id
  );
  // ✅ Check if the user is the creator of the ticket
  const isCreator = ticket.ticket_created_by === user?.user_id;

  if (!isAdmin && !isAssigned && !isReviewer && !isCreator) {
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
            <strong>Created By:</strong> {ticket.ticket_created_by_name}
          </Text>

          {/* ✅ Display Reviewers */}
          <div>
            <strong>Reviewers:</strong>
            {ticket.reviewers.length > 0 ? (
              <ul>
                {ticket.reviewers.map((r) => (
                  <li key={r.reviewer_id}>
                    {r.reviewer_name} -{" "}
                    <Badge
                      color={
                        r.approval_status === "PENDING"
                          ? "yellow"
                          : r.approval_status === "APPROVED"
                          ? "green"
                          : r.approval_status === "REJECTED"
                          ? "red"
                          : "gray"
                      }
                    >
                      {r.approval_status}
                    </Badge>
                  </li>
                ))}
              </ul>
            ) : (
              <Text color="dimmed">No reviewers assigned.</Text>
            )}
          </div>

          {/* ✅ Shared Users */}
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

          {(isAdmin || ticket.ticket_created_by === user?.user_id) && (
            <>
              <Button onClick={() => setIsSharing(true)} mt="md">
                Share Ticket
              </Button>
              <Modal
                opened={isSharing}
                onClose={() => setIsSharing(false)}
                title="Share Ticket"
              >
                <Select
                  placeholder="Select user to share with"
                  data={allUsers}
                  value={sharedUser}
                  onChange={setSharedUser}
                  searchable
                />
                <Button onClick={handleShareTicket} mt="md">
                  Share
                </Button>
              </Modal>
            </>
          )}

          <Link href="/dashboard">
            <Button mt="md">Back to Dashboard</Button>
          </Link>
        </Stack>
      </Card>
    </Container>
  );
};

export default TicketDetailsPage;
