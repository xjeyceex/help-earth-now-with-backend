"use client";

import {
  getAllUsers,
  getCanvassDetails,
  getTicketDetails,
} from "@/actions/get";
import { shareTicket } from "@/actions/post";
import CanvassForm from "@/components/CanvassForm";
import CommentThreadBackup from "@/components/CommentThreadBackup";
import LoadingState from "@/components/LoadingState";
import { useUserStore } from "@/stores/userStore";
import {
  CanvassAttachment,
  CanvassDetail,
  TicketDetailsType,
} from "@/utils/types";
import {
  Avatar,
  Badge,
  Button,
  Card,
  Center,
  Collapse,
  Container,
  Flex,
  Group,
  Loader,
  Modal,
  MultiSelect,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import {
  IconArrowLeft,
  IconChevronDown,
  IconChevronUp,
  IconFile,
  IconFileText,
} from "@tabler/icons-react";
import DOMPurify from "dompurify";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const TicketDetailsPage = () => {
  const { ticket_id } = useParams() as { ticket_id: string };
  const { user } = useUserStore();

  const [ticket, setTicket] = useState<TicketDetailsType | null>(null);
  const [canvassDetails, setCanvassDetails] = useState<CanvassDetail[] | null>(
    null
  );
  const [isFormVisible, setIsFormVisible] = useState(true);
  const [isCanvasVisible, setIsCanvasVisible] = useState(true);
  const [loading, setLoading] = useState(true);
  const [canvasLoading, setCanvasLoading] = useState(true);
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

  const fetchUsers = async () => {
    const users = await getAllUsers(ticket_id);

    if ("error" in users) {
      console.error(users.message);
      return;
    }

    setAllUsers(users);
  };

  const fetchCanvassDetails = async () => {
    if (!ticket_id) return;

    setCanvasLoading(true);

    try {
      const data = await getCanvassDetails({ ticketId: ticket_id });
      setCanvassDetails(data);
    } finally {
      setCanvasLoading(false);
    }
  };

  useEffect(() => {
    fetchTicketDetails();
    fetchUsers(); // ✅ No need to call fetchUsers API anymore
    fetchCanvassDetails();
  }, [ticket_id]);

  if (!user || loading) {
    return <LoadingState />;
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
    <Container size="md" py="xl">
      <Flex justify="flex-start" align="center" gap="lg">
        <Link href="/tickets">
          <Button variant="light" leftSection={<IconArrowLeft size={16} />}>
            Go back
          </Button>
        </Link>
      </Flex>
      <Card shadow="sm" mt="lg" radius="sm" withBorder px={30}>
        <Title ta="center" my={20} fz="h2">
          Ticket Details
        </Title>

        <Card shadow="sm" radius="sm" withBorder px={30}>
          <Stack w="100%">
            <Group justify="space-between">
              <Group>
                <Avatar
                  src={ticket.ticket_created_by_avatar}
                  radius="xl"
                  size="md"
                />
                <Text size="sm" c="dimmed">
                  <strong>{ticket.ticket_created_by_name}</strong> raised this
                  on{" "}
                  {new Date(ticket.ticket_date_created).toLocaleString(
                    "en-US",
                    {
                      day: "2-digit",
                      month: "short",
                      year: "2-digit",
                      hour: "numeric",
                      minute: "numeric",
                      hour12: true,
                    }
                  )}
                </Text>
              </Group>
              <Text
                size="sm"
                c="blue"
                style={{
                  cursor: "pointer",
                  textDecoration: "none",
                  transition: "text-decoration 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.textDecoration = "underline")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.textDecoration = "none")
                }
                onClick={() => setIsFormVisible((prev) => !prev)}
              >
                {isFormVisible ? "Hide details" : "Show details"}
              </Text>
            </Group>
          </Stack>

          <Collapse in={isFormVisible}>
            {isFormVisible && (
              <>
                <br />
                <Stack>
                  <Text size="md">
                    <strong>RF Date Received:</strong>{" "}
                    {new Date(ticket.ticket_rf_date_received).toLocaleString(
                      "en-US",
                      {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      }
                    )}
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
                    <strong>Item Description:</strong>{" "}
                    {ticket.ticket_item_description}
                  </Text>
                  <Text size="md">
                    <strong>Quantity:</strong> {ticket.ticket_quantity}
                  </Text>
                  <Text size="md">
                    <strong>Specifications:</strong>
                    <span
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(
                          ticket.ticket_specifications
                        ),
                      }}
                    />
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
                      <Button
                        w="fit-content"
                        onClick={() => setIsSharing(true)}
                      >
                        Share Ticket
                      </Button>
                      <Modal
                        opened={isSharing}
                        onClose={() => setIsSharing(false)}
                        title="Share Ticket"
                        centered
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

                <br />

                <Text size="md">
                  <strong>Notes:</strong>
                  <span
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(ticket.ticket_notes),
                    }}
                  />
                </Text>

                <Card
                  shadow="sm"
                  radius="sm"
                  withBorder
                  px={30}
                  style={{ cursor: !isCanvasVisible ? "pointer" : "default" }} // Change cursor based on collapse state
                  onClick={
                    !isCanvasVisible
                      ? () => setIsCanvasVisible(true)
                      : undefined
                  }
                >
                  {canvasLoading ? (
                    <Center p="md">
                      <Loader size="sm" />
                    </Center>
                  ) : (
                    <Stack p={0}>
                      <Stack
                        w="100%"
                        onClick={
                          isCanvasVisible
                            ? () => setIsCanvasVisible(false)
                            : undefined
                        } // Click only the header to collapse when open
                        style={{ cursor: "pointer" }}
                      >
                        <Group justify="space-between">
                          <Group gap={6}>
                            <IconFileText size={18} stroke={1.5} />
                            <Text size="sm">Canvass Form</Text>
                          </Group>

                          <Text size="sm">
                            {isCanvasVisible ? (
                              <IconChevronUp size={18} />
                            ) : (
                              <IconChevronDown size={18} />
                            )}
                          </Text>
                        </Group>
                      </Stack>

                      <Collapse in={isCanvasVisible}>
                        {(canvassDetails?.length ?? 0) > 0 ? (
                          <>
                            {canvassDetails?.map((canvass: CanvassDetail) => (
                              <Stack key={canvass.canvass_form_id} px="sm">
                                <Text>
                                  <strong>RF Date Received:</strong>{" "}
                                  {new Date(
                                    canvass.canvass_form_rf_date_received
                                  ).toLocaleDateString("en-US", {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                  })}
                                </Text>
                                <Text>
                                  <strong>Recommended Supplier:</strong>{" "}
                                  {canvass.canvass_form_recommended_supplier}
                                </Text>
                                <Text>
                                  <strong>Lead Time (days):</strong>{" "}
                                  {canvass.canvass_form_lead_time_day}
                                </Text>
                                <Text>
                                  <strong>Total Amount:</strong> ₱
                                  {canvass.canvass_form_total_amount.toFixed(2)}
                                </Text>
                                {canvass.canvass_form_payment_terms && (
                                  <Text>
                                    <strong>Terms:</strong>{" "}
                                    {canvass.canvass_form_payment_terms}
                                  </Text>
                                )}
                                <Text>
                                  <strong>Submitted By:</strong>{" "}
                                  {canvass.submitted_by.user_full_name ||
                                    "Unknown"}
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
                                    <Text fw={500}>Attachments:</Text>
                                    {canvass.attachments.map(
                                      (attachment: CanvassAttachment) => (
                                        <Link
                                          key={attachment.canvass_attachment_id}
                                          href={
                                            attachment.canvass_attachment_url ||
                                            "#"
                                          }
                                          target="_blank"
                                          style={{
                                            color: "#228be6",
                                            textDecoration: "none",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "8px",
                                            padding: "4px 0",
                                          }}
                                        >
                                          <IconFile size={16} />
                                          {attachment.canvass_attachment_type ||
                                            "Document"}{" "}
                                          (
                                          {new Date(
                                            attachment.canvass_attachment_created_at
                                          ).toLocaleDateString()}
                                          )
                                        </Link>
                                      )
                                    )}
                                  </div>
                                )}
                              </Stack>
                            ))}
                          </>
                        ) : user?.user_id === ticket?.ticket_created_by ? ( // Only show form if user is creator
                          <CanvassForm
                            ticketId={ticket?.ticket_id}
                            updateCanvassDetails={fetchCanvassDetails}
                          />
                        ) : (
                          <Text p="md" c="dimmed">
                            Canvass form is not available yet.
                          </Text>
                        )}
                      </Collapse>
                    </Stack>
                  )}
                </Card>
              </>
            )}
          </Collapse>
        </Card>

        <Text size="md" mt="md">
          {" "}
          Activity
        </Text>
        <CommentThreadBackup ticket_id={ticket_id} />
      </Card>
    </Container>
  );
};

export default TicketDetailsPage;
