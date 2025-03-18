"use client";

import {
  getAllUsers,
  getCanvassDetails,
  getTicketDetails,
} from "@/actions/get";
import { shareTicket } from "@/actions/post";
import CanvassForm from "@/components/CanvassForm";
import { useUserStore } from "@/stores/userStore";
import { TicketDetailsType } from "@/utils/types";
import {
  Avatar,
  Badge,
  Button,
  Card,
  Container,
  Divider,
  Flex,
  Group,
  Loader,
  Modal,
  MultiSelect,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export type CanvassAttachment = {
  canvass_attachment_id: string;
  canvass_attachment_type: string | null;
  canvass_attachment_url: string | null;
  canvass_attachment_created_at: string;
};

export type CanvassSubmitter = {
  user_id: string;
  user_full_name: string | null;
  user_email: string | null;
  user_avatar: string | null;
};

export type CanvassDetail = {
  canvass_form_id: string;
  canvass_form_ticket_id: string;
  canvass_form_rf_date_received: string;
  canvass_form_recommended_supplier: string;
  canvass_form_lead_time_day: number;
  canvass_form_quotation_price: number;
  canvass_form_quotation_terms: string | null;
  canvass_form_attachment_url: string | null;
  canvass_form_submitted_by: string;
  canvass_form_date_submitted: string;
  submitted_by: CanvassSubmitter;
  attachments: CanvassAttachment[];
};

const TicketDetailsPage = () => {
  const { ticket_id } = useParams() as { ticket_id: string };
  const { user } = useUserStore();

  const [ticket, setTicket] = useState<TicketDetailsType | null>(null);
  const [canvassDetails, setCanvassDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [isSharing, setIsSharing] = useState(false);
  const [allUsers, setAllUsers] = useState<{ value: string; label: string }[]>(
    []
  );

  const handleShareTicket = async () => {
    if (!selectedUsers.length || !ticket_id) return;

    // Share the ticket with each selected user
    await Promise.all(
      selectedUsers.map((userId) => shareTicket(ticket_id, userId))
    );

    // Filter out the selected users from the dropdown
    setAllUsers((prev) =>
      prev.filter((user) => !selectedUsers.includes(user.value))
    );

    setIsSharing(false);
    fetchTicketDetails();
    setSelectedUsers([]);
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

    // Filter out users who are already reviewers
    const filteredUsers = users.filter(
      (user) =>
        !ticket?.reviewers.some(
          (reviewer) => reviewer.reviewer_id === user.value
        )
    );

    setAllUsers(filteredUsers);
  };

  const fetchCanvassDetails = async () => {
    if (!ticket_id) return;
    setCanvassDetails(await getCanvassDetails({ ticketId: ticket_id }));
  };

  useEffect(() => {
    fetchTicketDetails();
    fetchUsers(); // ✅ No need to call fetchUsers API anymore
    fetchCanvassDetails();
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
      <Flex justify="flex-start" align="center" gap="lg">
        <Link href="/tickets">
          <Button variant="light" leftSection={<IconArrowLeft size={16} />}>
            Go back
          </Button>
        </Link>
      </Flex>
      <Card shadow="sm" mt="lg" radius="md" withBorder px={30}>
        <Title ta="center" my={20} fz="h2">
          Ticket Details
        </Title>

        <Stack w="100%">
          <Group>
            <Avatar
              src={ticket.ticket_created_by_avatar}
              radius="xl"
              size="md"
            />
            <Text size="sm" c="dimmed">
              <strong>{ticket.ticket_created_by_name}</strong> raised this on{" "}
              {new Date(ticket.ticket_date_created).toLocaleString("en-US", {
                day: "2-digit",
                month: "short",
                year: "2-digit",
                hour: "numeric",
                minute: "numeric",
                hour12: true,
              })}
            </Text>
          </Group>
        </Stack>

        <br />

        <Stack>
          <Text size="md">
            <strong>RF Date Received:</strong>{" "}
            {new Date(ticket.ticket_rf_date).toLocaleString("en-US", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </Text>
          <div>
            <strong>Ticket Status:</strong>{" "}
            <Badge
              color={
                ticket?.ticket_status === "PENDING"
                  ? "yellow"
                  : ticket?.ticket_status === "APPROVED"
                  ? "green"
                  : ticket?.ticket_status === "IN PROGRESS"
                  ? "blue"
                  : ticket?.ticket_status === "COMPLETED"
                  ? "teal"
                  : ticket?.ticket_status === "REJECTED"
                  ? "red"
                  : "gray"
              }
            >
              {ticket?.ticket_status}
            </Badge>
          </div>

          <Text size="md">
            <strong>Item Description:</strong> {ticket.ticket_item_description}
          </Text>
          <Text size="md">
            <strong>Quantity:</strong> {ticket.ticket_quantity}
          </Text>
          <Text size="md">
            <strong>Specifications:</strong> {ticket.ticket_specifications}
          </Text>
          <Text size="md">
            <strong>Ticket Status:</strong> {ticket.ticket_status}
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
              <Text c="dimmed">No reviewers assigned.</Text>
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
              <Text c="dimmed">Not shared with anyone yet.</Text>
            )}
          </div>

          {(isAdmin || ticket?.ticket_created_by === user?.user_id) && (
            <>
              <Button w="fit-content" onClick={() => setIsSharing(true)}>
                Share Ticket
              </Button>
              <Modal
                opened={isSharing}
                onClose={() => setIsSharing(false)}
                title="Share Ticket"
              >
                <MultiSelect
                  data={allUsers}
                  value={selectedUsers}
                  onChange={setSelectedUsers}
                  placeholder="Select users to share with"
                  searchable
                  clearable
                />
                <Button onClick={handleShareTicket} mt="md">
                  Share
                </Button>
              </Modal>
            </>
          )}
        </Stack>

        <Divider my="xl" />

        <Stack p={0}>
          {canvassDetails?.length > 0 ? (
            <Stack>
              <Title fz="h2" ta="center" mb="md">
                Canvass Details
              </Title>

              {canvassDetails?.map((canvass: CanvassDetail) => (
                <Stack key={canvass.canvass_form_id}>
                  <Text>
                    <strong>RF Date Received:</strong>{" "}
                    {canvass.canvass_form_rf_date_received}
                  </Text>
                  <Text>
                    <strong>Recommended Supplier:</strong>{" "}
                    {canvass.canvass_form_recommended_supplier}
                  </Text>
                  <Text>
                    <strong>Lead Time Day:</strong>{" "}
                    {canvass.canvass_form_lead_time_day}
                  </Text>
                  <Text>
                    <strong>Quotation Price:</strong> ₱
                    {canvass.canvass_form_quotation_price.toFixed(2)}
                  </Text>
                  {canvass.canvass_form_quotation_terms && (
                    <Text>
                      <strong>Terms:</strong>{" "}
                      {canvass.canvass_form_quotation_terms}
                    </Text>
                  )}
                  <Text>
                    <strong>Submitted By:</strong>{" "}
                    {canvass.submitted_by.user_full_name || "Unknown"}
                  </Text>
                  <Text>
                    <strong>Date Submitted:</strong>{" "}
                    {new Date(
                      canvass.canvass_form_date_submitted
                    ).toLocaleDateString()}
                  </Text>

                  {/* Attachments Section */}
                  {canvass.attachments.length > 0 && (
                    <div>
                      <strong>Attachments:</strong>{" "}
                      <ul>
                        {canvass.attachments.map(
                          (attachment: CanvassAttachment) => (
                            <li key={attachment.canvass_attachment_id}>
                              <Link
                                href={attachment.canvass_attachment_url || "#"}
                                target="_blank"
                                style={{
                                  color: "inherit",
                                  textDecoration: "underline",
                                }}
                              >
                                {attachment.canvass_attachment_type ||
                                  "Document"}{" "}
                                (
                                {new Date(
                                  attachment.canvass_attachment_created_at
                                ).toLocaleDateString()}
                                )
                              </Link>
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  )}
                </Stack>
              ))}
            </Stack>
          ) : (
            <CanvassForm
              ticketId={ticket?.ticket_id}
              updateCanvassDetails={fetchCanvassDetails}
            />
          )}
        </Stack>
      </Card>
    </Container>
  );
};

export default TicketDetailsPage;
