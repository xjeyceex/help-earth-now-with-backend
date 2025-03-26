"use client";

import {
  getCanvassDetails,
  getComments,
  getTicketDetails,
} from "@/actions/get";
import { addComment, startCanvass } from "@/actions/post";
import { updateApprovalStatus } from "@/actions/update";
import CanvassForm from "@/components/CanvassForm";
import CommentThread from "@/components/CommentThread";
import LoadingStateProtected from "@/components/LoadingStateProtected";
import { useCommentsStore } from "@/stores/commentStore";
import { useUserStore } from "@/stores/userStore";
import {
  CanvassAttachment,
  CanvassDetail,
  TicketDetailsType,
} from "@/utils/types";
import {
  ActionIcon,
  Alert,
  Avatar,
  Badge,
  Box,
  Button,
  Center,
  Collapse,
  Container,
  Divider,
  Grid,
  Group,
  Loader,
  Modal,
  Paper,
  Skeleton,
  Stack,
  Text,
  Textarea,
  ThemeIcon,
  Title,
  Tooltip,
  useMantineColorScheme,
} from "@mantine/core";
import {
  IconArrowLeft,
  IconChevronDown,
  IconChevronUp,
  IconClipboardCheck,
  IconClipboardX,
  IconClock,
  IconFile,
  IconFileText,
  IconPlus,
  IconShoppingCartFilled,
  IconX,
} from "@tabler/icons-react";
import DOMPurify from "dompurify";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ShareTicketModal from "./_components/ShareTicketModal";

const TicketDetailsPage = () => {
  const { ticket_id } = useParams() as { ticket_id: string };
  const { user } = useUserStore();
  const { setComments } = useCommentsStore();
  const router = useRouter();
  const { colorScheme } = useMantineColorScheme();

  const [ticket, setTicket] = useState<TicketDetailsType | null>(null);
  const [canvassDetails, setCanvassDetails] = useState<CanvassDetail[] | null>(
    null,
  );
  const [isFormVisible, setIsFormVisible] = useState(true);
  const [isCanvasVisible, setIsCanvasVisible] = useState(true);
  const [loading, setLoading] = useState(true);
  const [canvasLoading, setCanvasLoading] = useState(true);
  const [isSharing, setIsSharing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [approvalStatus, setApprovalStatus] = useState<string | null>(null);
  const [canvassStartOpen, setCanvassStartOpen] = useState(false);
  const [canvassApprovalOpen, setCanvassApprovalOpen] = useState(false);
  const [newComment, setNewComment] = useState<string>("");
  const [statusLoading, setStatusLoading] = useState(false);

  const handleApprovalConfirm = async () => {
    if (!user) {
      console.error("User not logged in.");
      return;
    }

    setStatusLoading(true);

    // Define the correct `approval_status` values
    const newApprovalStatus =
      approvalStatus === "IN REVIEW" ? "APPROVED" : "REJECTED";

    // Optimistic update
    setTicket((prev) =>
      prev
        ? {
            ...prev,
            ticket_status: approvalStatus || prev.ticket_status, // Ensure it's always a string
            reviewers: prev.reviewers.map((reviewer) =>
              reviewer.reviewer_id === user.user_id
                ? { ...reviewer, approval_status: newApprovalStatus }
                : reviewer,
            ),
          }
        : null,
    );

    try {
      if (newComment.trim()) {
        await addComment(ticket_id, newComment, user.user_id);
        setNewComment("");
      }

      // Insert approval record
      await updateApprovalStatus({
        approval_ticket_id: ticket_id,
        approval_review_status: newApprovalStatus, // Save APPROVED or REJECTED
        approval_reviewed_by: user.user_id,
      });

      handleCanvassAction(approvalStatus ?? "IN REVIEW");
      setCanvassApprovalOpen(false);
      setApprovalStatus(null);
    } catch (error) {
      console.error("Error adding comment or starting canvass:", error);

      // Revert UI if API call fails
      setTicket((prev) =>
        prev
          ? {
              ...prev,
              ticket_status: "FOR REVIEW OF SUBMISSIONS",
              reviewers: prev.reviewers.map((reviewer) =>
                reviewer.reviewer_id === user.user_id
                  ? { ...reviewer, approval_status: "PENDING" } // Reset to a safe fallback
                  : reviewer,
              ),
            }
          : null,
      );
    } finally {
      setStatusLoading(false);
    }
  };

  const handleStartConfirm = async () => {
    if (!user) {
      console.error("User not logged in.");
      return;
    }
    setStatusLoading(true);
    try {
      if (newComment.trim()) {
        await addComment(ticket_id, newComment, user.user_id);
        setNewComment("");
      }

      setTicket((prev) =>
        prev ? { ...prev, ticket_status: "WORK IN PROGRESS" } : null,
      );

      await handleCanvassAction("WORK IN PROGRESS");

      setCanvassStartOpen(false);
    } catch (error) {
      console.error("Error adding comment or starting canvass:", error);

      setTicket((prev) =>
        prev ? { ...prev, ticket_status: "FOR CANVASS" } : null,
      );
    } finally {
      setStatusLoading(false);
    }
  };

  const handleCanvassAction = async (status: string) => {
    if (!user || isProcessing) return;

    setIsProcessing(true);
    try {
      await startCanvass(ticket_id, user.user_id, status); // Pass the status argument
    } catch (error) {
      console.error("Error starting canvass:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const fetchTicketDetails = async () => {
    if (!ticket_id) return;
    const tickets = await getTicketDetails(ticket_id);
    if (Array.isArray(tickets) && tickets.length > 0) {
      setTicket(tickets[0]);
    }
    setLoading(false);
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

  const fetchComments = async () => {
    try {
      const fetchedComments = await getComments(ticket_id);
      setComments(fetchedComments);
    } catch (error) {
      console.error("Unexpected error:", error);
    }
  };

  useEffect(() => {
    fetchTicketDetails();
    fetchComments();
    fetchCanvassDetails();
  }, []);

  if (!user || loading) {
    return <LoadingStateProtected />;
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
  const isSharedToMe = ticket.shared_users?.some(
    (u) => u.user_id === user?.user_id,
  );
  const isReviewer = ticket.reviewers?.some(
    (r) => r.reviewer_id === user?.user_id,
  );

  // ✅ Check if the user is the creator of the ticket
  const isCreator = ticket.ticket_created_by === user?.user_id;

  if (!isAdmin && !isSharedToMe && !isReviewer && !isCreator) {
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
    <Box p={{ base: "lg", sm: "xl" }}>
      {/* Header Section with Back Button */}
      <Stack gap={2} mb="md">
        <Button
          variant="light"
          onClick={() => router.push("/tickets")}
          leftSection={<IconArrowLeft size={16} />}
          radius="md"
          w="fit-content"
          mb="xl"
        >
          Back to Tickets
        </Button>
        <Group>
          <Title
            order={2}
            styles={(theme) => ({
              root: {
                fontSize: "2rem",
                fontWeight: 600,
                color: theme.colors.dark[8],
                borderLeft: `4px solid ${theme.colors.blue[5]}`,
                paddingLeft: "16px",
                position: "relative",
                "&::after": {
                  content: '""',
                  position: "absolute",
                  bottom: -4,
                  left: 16,
                  width: "40%",
                  height: "2px",
                  background: theme.colors.gray[3],
                },
              },
            })}
          >
            Ticket ID:{" "}
            <Badge
              fz="lg"
              fw={600}
              p="md"
              style={{ position: "relative", top: -4 }}
            >
              {ticket_id}
            </Badge>
          </Title>
        </Group>
      </Stack>

      {/* Main Content Grid */}
      <Grid gutter="xl">
        {/* Left Column */}
        <Grid.Col span={{ base: 12, md: 8 }}>
          <Paper
            radius="lg"
            shadow="sm"
            p="xl"
            withBorder
            style={(theme) => ({
              borderColor:
                colorScheme === "dark"
                  ? theme.colors.dark[5]
                  : theme.colors.gray[1],
            })}
          >
            {/* Ticket Header */}
            <Group align="center" justify="space-between" mb="xl">
              <Group gap="lg">
                <Box pos="relative">
                  <Avatar
                    src={ticket.ticket_created_by_avatar}
                    radius="xl"
                    size={64}
                  />
                  <Badge
                    size="xs"
                    variant="filled"
                    color="blue"
                    pos="absolute"
                    bottom={-4}
                    right={-4}
                  >
                    Creator
                  </Badge>
                </Box>
                <Stack gap={4}>
                  <Text size="sm" fw={600} tt="uppercase" c="dimmed">
                    Created by
                  </Text>
                  <Text size="xl" fw={700}>
                    {ticket.ticket_created_by_name}
                  </Text>
                  <Group gap={6}>
                    <ThemeIcon size="xs" color="gray" variant="light">
                      <IconClock size={12} />
                    </ThemeIcon>
                    <Text size="xs" c="dimmed">
                      {new Date(ticket.ticket_date_created).toLocaleString(
                        "en-US",
                        {
                          day: "2-digit",
                          month: "short",
                          year: "2-digit",
                          hour: "numeric",
                          minute: "numeric",
                          hour12: true,
                        },
                      )}
                    </Text>
                  </Group>
                </Stack>
              </Group>
              <Tooltip label={isFormVisible ? "Hide details" : "Show details"}>
                <ActionIcon
                  variant={isFormVisible ? "filled" : "light"}
                  onClick={() => setIsFormVisible((prev) => !prev)}
                  color={isFormVisible ? "blue" : "gray"}
                  radius="xl"
                  size={36}
                >
                  {isFormVisible ? (
                    <IconChevronUp size={18} />
                  ) : (
                    <IconChevronDown size={18} />
                  )}
                </ActionIcon>
              </Tooltip>
            </Group>

            {/* Ticket Details Collapse */}
            <Collapse in={isFormVisible} mt="xl">
              <Stack gap="xl">
                {/* RF Date and Item Info */}
                <Grid gutter="xl">
                  <Grid.Col span={12}>
                    <Stack gap="xl">
                      <TicketDetailsItem
                        label="RF Date Received"
                        value={ticket.ticket_rf_date_received}
                      />
                      <TicketDetailsItem
                        label="Item Name"
                        value={ticket.ticket_item_name}
                      />
                      <TicketDetailsItem
                        label="Quantity"
                        value={ticket.ticket_quantity}
                      />

                      {ticket.ticket_specifications && (
                        <Stack gap={0}>
                          <Text size="md" c="dimmed" fw={500}>
                            Specifications
                          </Text>
                          <Box>
                            <Text
                              dangerouslySetInnerHTML={{
                                __html: DOMPurify.sanitize(
                                  ticket.ticket_specifications,
                                ),
                              }}
                            />
                          </Box>
                        </Stack>
                      )}

                      {ticket.ticket_notes && (
                        <Stack gap={4}>
                          <Text size="md" c="dimmed" fw={500}>
                            Notes
                          </Text>
                          <Box>
                            <div
                              dangerouslySetInnerHTML={{
                                __html: DOMPurify.sanitize(ticket.ticket_notes),
                              }}
                            />
                          </Box>
                        </Stack>
                      )}

                      {/* Reviewers */}
                      {statusLoading ? (
                        <Skeleton height={24} radius="md" />
                      ) : (
                        <Box>
                          <Stack gap="md">
                            <Text size="md" c="dimmed" fw={500}>
                              Reviewers
                            </Text>
                            {ticket.reviewers.length > 0 ? (
                              <Stack gap="xs">
                                {ticket.reviewers.map((reviewer) => (
                                  <Box key={reviewer.reviewer_id}>
                                    <Group justify="space-between">
                                      <Group gap="md">
                                        <Avatar
                                          radius="xl"
                                          size="md"
                                          color={
                                            reviewer.approval_status ===
                                            "APPROVED"
                                              ? "green"
                                              : reviewer.approval_status ===
                                                  "REJECTED"
                                                ? "red"
                                                : "gray"
                                          }
                                        >
                                          {reviewer.reviewer_name.charAt(0)}
                                        </Avatar>
                                        <Text fw={500}>
                                          {reviewer.reviewer_name}
                                        </Text>
                                      </Group>
                                      <Badge
                                        variant="dot"
                                        size="lg"
                                        color={
                                          reviewer.approval_status ===
                                          "APPROVED"
                                            ? "green"
                                            : reviewer.approval_status ===
                                                "REJECTED"
                                              ? "red"
                                              : "gray"
                                        }
                                      >
                                        {reviewer.approval_status}
                                      </Badge>
                                    </Group>
                                  </Box>
                                ))}
                              </Stack>
                            ) : (
                              <Alert variant="light" color="gray" radius="md">
                                <Text size="sm">No reviewers assigned yet</Text>
                              </Alert>
                            )}
                          </Stack>
                        </Box>
                      )}
                    </Stack>
                  </Grid.Col>
                </Grid>

                {/* Canvass Form Section */}
                {ticket?.ticket_status !== "FOR CANVASS" && (
                  <>
                    <Divider />
                    <Box
                      onClick={
                        !isCanvasVisible
                          ? () => setIsCanvasVisible(true)
                          : undefined
                      }
                    >
                      {canvasLoading ? (
                        <Center>
                          <Loader size="sm" variant="dots" />
                        </Center>
                      ) : (
                        <Stack gap="xl">
                          <Group
                            justify="space-between"
                            onClick={
                              isCanvasVisible
                                ? () => setIsCanvasVisible(false)
                                : undefined
                            }
                            style={{ cursor: "pointer" }}
                          >
                            <Group gap="md">
                              <ThemeIcon
                                size="xl"
                                radius="md"
                                variant="light"
                                color="blue"
                              >
                                <IconFileText size={20} stroke={1.5} />
                              </ThemeIcon>
                              <Text fw={600}>Canvass Form</Text>
                            </Group>
                            <ActionIcon
                              variant="subtle"
                              color="gray"
                              radius="xl"
                            >
                              {isCanvasVisible ? (
                                <IconChevronUp size={20} stroke={1.5} />
                              ) : (
                                <IconChevronDown size={20} stroke={1.5} />
                              )}
                            </ActionIcon>
                          </Group>

                          <Collapse in={isCanvasVisible}>
                            {(canvassDetails?.length ?? 0) > 0 ? (
                              <Stack gap="xl">
                                {canvassDetails?.map(
                                  (canvass: CanvassDetail) => (
                                    <Box key={canvass.canvass_form_id}>
                                      <Grid gutter="xl">
                                        <Grid.Col span={6}>
                                          <Stack gap="xl">
                                            <TicketDetailsItem
                                              label="RF Date Received"
                                              value={
                                                canvass.canvass_form_rf_date_received
                                              }
                                            />
                                            <TicketDetailsItem
                                              label="Lead Time"
                                              value={
                                                canvass.canvass_form_lead_time_day
                                              }
                                            />
                                            <TicketDetailsItem
                                              label="Payment Terms"
                                              value={
                                                canvass.canvass_form_payment_terms
                                              }
                                            />
                                            <Stack gap={4}>
                                              <Text
                                                size="md"
                                                c="dimmed"
                                                fw={500}
                                              >
                                                Submitted By
                                              </Text>
                                              <Group gap="md">
                                                <Avatar radius="xl" size="md">
                                                  {canvass.submitted_by.user_full_name?.charAt(
                                                    0,
                                                  )}
                                                </Avatar>
                                                <Stack gap={0}>
                                                  <Text fw={500}>
                                                    {canvass.submitted_by
                                                      .user_full_name ||
                                                      "Unknown"}
                                                  </Text>
                                                  <Text size="xs" c="dimmed">
                                                    {new Date(
                                                      canvass.canvass_form_date_submitted,
                                                    ).toLocaleString()}
                                                  </Text>
                                                </Stack>
                                              </Group>
                                            </Stack>
                                          </Stack>
                                        </Grid.Col>
                                        <Grid.Col span={6}>
                                          <Stack gap="xl">
                                            <TicketDetailsItem
                                              label="Recommended Supplier"
                                              value={
                                                canvass.canvass_form_recommended_supplier
                                              }
                                            />
                                            <TicketDetailsItem
                                              label="Total Amount"
                                              value={
                                                canvass.canvass_form_total_amount
                                              }
                                            />
                                            {canvass.attachments.length > 0 && (
                                              <Stack gap={4}>
                                                <Text
                                                  size="md"
                                                  c="dimmed"
                                                  fw={500}
                                                >
                                                  Attachments
                                                </Text>
                                                <Group gap="xs">
                                                  {canvass.attachments.map(
                                                    (
                                                      attachment: CanvassAttachment,
                                                    ) => (
                                                      <Link
                                                        key={
                                                          attachment.canvass_attachment_id
                                                        }
                                                        href={
                                                          attachment.canvass_attachment_url ||
                                                          "#"
                                                        }
                                                        target="_blank"
                                                      >
                                                        <Tooltip
                                                          label={`${
                                                            attachment.canvass_attachment_type ||
                                                            "Document"
                                                          } - ${new Date(
                                                            attachment.canvass_attachment_created_at,
                                                          ).toLocaleDateString()}`}
                                                        >
                                                          <ActionIcon
                                                            variant="light"
                                                            color="blue"
                                                            size="lg"
                                                            radius="md"
                                                          >
                                                            <IconFile
                                                              size={20}
                                                            />
                                                          </ActionIcon>
                                                        </Tooltip>
                                                      </Link>
                                                    ),
                                                  )}
                                                </Group>
                                              </Stack>
                                            )}
                                          </Stack>
                                        </Grid.Col>
                                      </Grid>
                                    </Box>
                                  ),
                                )}
                              </Stack>
                            ) : user?.user_id === ticket?.ticket_created_by ? (
                              <CanvassForm
                                ticketId={ticket?.ticket_id}
                                updateCanvassDetails={fetchCanvassDetails}
                                setTicket={setTicket}
                              />
                            ) : (
                              <Alert variant="light" color="gray" radius="md">
                                <Text>Canvass form is not available yet.</Text>
                              </Alert>
                            )}
                          </Collapse>
                        </Stack>
                      )}
                    </Box>
                  </>
                )}
              </Stack>
            </Collapse>
          </Paper>

          {/* Activity Section */}
          <Paper
            mt="xl"
            radius="lg"
            shadow="sm"
            p="xl"
            withBorder
            style={(theme) => ({
              borderColor:
                colorScheme === "dark"
                  ? theme.colors.dark[5]
                  : theme.colors.gray[1],
            })}
          >
            <Stack gap="xl">
              <Group justify="space-between" align="center">
                <Title order={4}>Activity</Title>
              </Group>
              <Box className="comment-thread-container">
                <CommentThread ticket_id={ticket_id} />
              </Box>
            </Stack>
          </Paper>
        </Grid.Col>

        {/* Right Column - Status and Actions */}
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Paper
            radius="lg"
            shadow="sm"
            p="xl"
            withBorder
            style={(theme) => ({
              borderColor:
                colorScheme === "dark"
                  ? theme.colors.dark[5]
                  : theme.colors.gray[1],
            })}
          >
            <Stack gap="xl">
              {/* Status Section */}
              <Box>
                <Text size="md" fw={500} c="dimmed" mb="md">
                  Status
                </Text>
                {statusLoading ? (
                  <Skeleton height={40} radius="md" />
                ) : (
                  <Badge
                    py="md"
                    size="lg"
                    radius="md"
                    color={
                      ticket?.ticket_status === "FOR REVIEW OF SUBMISSIONS"
                        ? "yellow"
                        : ticket?.ticket_status === "IN REVIEW"
                          ? "blue"
                          : ticket?.ticket_status === "WORK IN PROGRESS"
                            ? "indigo"
                            : ticket?.ticket_status === "DONE"
                              ? "teal"
                              : ticket?.ticket_status === "CANCELED"
                                ? "red"
                                : "gray"
                    }
                    fullWidth
                  >
                    {ticket?.ticket_status}
                  </Badge>
                )}
              </Box>

              {/* Actions Section */}
              {ticket?.ticket_status !== "CANCELED" && (
                <Box>
                  <Text size="md" fw={500} c="dimmed" mb="md">
                    Actions
                  </Text>
                  <Stack gap="sm">
                    {ticket?.ticket_status === "FOR CANVASS" && isCreator && (
                      <Button
                        leftSection={<IconClipboardCheck size={18} />}
                        radius="md"
                        variant="light"
                        color="blue"
                        fullWidth
                        onClick={() => setCanvassStartOpen(true)}
                      >
                        Start Canvass
                      </Button>
                    )}

                    {ticket?.ticket_status === "FOR REVIEW OF SUBMISSIONS" &&
                      isReviewer && (
                        <>
                          <Button
                            leftSection={<IconClipboardCheck size={18} />}
                            radius="md"
                            color="teal"
                            fullWidth
                            onClick={() => {
                              setApprovalStatus("IN REVIEW");
                              setCanvassApprovalOpen(true);
                            }}
                          >
                            Approve
                          </Button>
                          <Button
                            leftSection={<IconClipboardX size={18} />}
                            radius="md"
                            color="red"
                            variant="light"
                            fullWidth
                            onClick={() => {
                              setApprovalStatus("DECLINED");
                              setCanvassApprovalOpen(true);
                            }}
                          >
                            Decline
                          </Button>
                        </>
                      )}

                    <Button
                      variant="light"
                      color="red"
                      leftSection={<IconX size={18} />}
                      radius="md"
                      fullWidth
                      onClick={() => handleCanvassAction("CANCELED")}
                    >
                      Cancel Request
                    </Button>
                  </Stack>
                </Box>
              )}

              <Divider />

              {/* Request Info Section */}
              <Box>
                <Text size="md" fw={500} c="dimmed" mb="md">
                  Request Details
                </Text>
                <Group gap="md">
                  <ThemeIcon size="xl" color="blue" variant="light" radius="md">
                    <IconShoppingCartFilled size={20} />
                  </ThemeIcon>
                  <Stack gap={2}>
                    <Text size="md" fw={500}>
                      Sourcing
                    </Text>
                    <Text size="sm" c="dimmed">
                      Procurement Request
                    </Text>
                  </Stack>
                </Group>
              </Box>

              <Divider />

              {/* Shared with Section */}
              <Box>
                <Group justify="space-between" mb="md">
                  <Text size="md" fw={500} c="dimmed">
                    Shared with
                  </Text>

                  {isCreator && (
                    <Tooltip label="Share ticket">
                      <ActionIcon
                        variant="light"
                        color="blue"
                        onClick={() => setIsSharing(true)}
                        radius="md"
                        size="md"
                      >
                        <IconPlus size={16} />
                      </ActionIcon>
                    </Tooltip>
                  )}
                </Group>

                <Stack gap="sm">
                  {/* Shared Users */}
                  {ticket.shared_users.map((user) => (
                    <Group key={user.user_id}>
                      <Avatar src={user.user_avatar} radius="xl" size="md" />
                      <Text size="sm" fw={500}>
                        {user.user_full_name}
                      </Text>
                    </Group>
                  ))}

                  {ticket.shared_users.length === 0 && (
                    <Text c="dimmed" size="sm">
                      No one has been shared with yet
                    </Text>
                  )}
                </Stack>
              </Box>
            </Stack>
          </Paper>
        </Grid.Col>
      </Grid>

      {/* Enhanced Modals */}
      <Modal
        opened={canvassApprovalOpen}
        onClose={() => setCanvassApprovalOpen(false)}
        title={
          <Group>
            <ThemeIcon
              size="lg"
              radius="md"
              variant="gradient"
              gradient={
                approvalStatus === "IN REVIEW"
                  ? { from: "teal", to: "lime" }
                  : { from: "red", to: "pink" }
              }
            >
              {approvalStatus === "IN REVIEW" ? (
                <IconClipboardCheck size={20} />
              ) : (
                <IconClipboardX size={20} />
              )}
            </ThemeIcon>
            <Text fw={500}>
              Confirm {approvalStatus === "IN REVIEW" ? "Approval" : "Decline"}
            </Text>
          </Group>
        }
        centered
        size="md"
        radius="lg"
      >
        <Stack gap="xl">
          <Textarea
            value={newComment}
            onChange={(event) => setNewComment(event.target.value)}
            placeholder="Add an optional comment..."
            label="Comment"
            autosize
            minRows={3}
            radius="md"
          />
          <Group justify="flex-end">
            <Button
              variant="light"
              color="gray"
              onClick={() => setCanvassApprovalOpen(false)}
              radius="md"
            >
              Cancel
            </Button>
            <Button
              variant="gradient"
              gradient={
                approvalStatus === "IN REVIEW"
                  ? { from: "teal", to: "lime" }
                  : { from: "red", to: "pink" }
              }
              onClick={handleApprovalConfirm}
              radius="md"
            >
              {approvalStatus === "IN REVIEW" ? "Approve" : "Decline"}
            </Button>
          </Group>
        </Stack>
      </Modal>

      <Modal
        opened={canvassStartOpen}
        onClose={() => setCanvassStartOpen(false)}
        title={
          <Group>
            <ThemeIcon
              size="lg"
              radius="md"
              variant="gradient"
              gradient={{ from: "blue", to: "cyan" }}
            >
              <IconClipboardCheck size={20} />
            </ThemeIcon>
            <Text fw={500}>Start Canvass</Text>
          </Group>
        }
        centered
        size="md"
        radius="lg"
      >
        <Stack gap="xl">
          <Textarea
            value={newComment}
            onChange={(event) => setNewComment(event.target.value)}
            placeholder="Add an optional comment..."
            label="Comment"
            autosize
            minRows={3}
            radius="md"
          />
          <Group justify="flex-end">
            <Button
              variant="light"
              color="gray"
              onClick={() => setCanvassStartOpen(false)}
              radius="md"
            >
              Cancel
            </Button>
            <Button
              variant="gradient"
              gradient={{ from: "blue", to: "cyan" }}
              onClick={handleStartConfirm}
              radius="md"
            >
              Start Canvass
            </Button>
          </Group>
        </Stack>
      </Modal>

      <ShareTicketModal
        isOpen={isSharing}
        onClose={() => setIsSharing(false)}
        ticketId={ticket_id}
        updateTicketDetails={fetchTicketDetails}
      />
    </Box>
  );
};

const TicketDetailsItem = ({ label, value }: any) => {
  return (
    <Stack gap={4}>
      <Text size="md" c="dimmed" fw={500}>
        {label}
      </Text>
      <Text fw={500}>{value}</Text>
    </Stack>
  );
};

export default TicketDetailsPage;
