"use client";

import {
  getCanvassDetails,
  getComments,
  getTicketDetails,
} from "@/actions/get";
import { addComment, startCanvass } from "@/actions/post";
import { revertApprovalStatus, updateApprovalStatus } from "@/actions/update";
import TicketStatusAndActions from "@/app/(protected)/tickets/[ticket_id]/_components/TicketStatusAndActions";
import CanvassForm from "@/components/CanvassForm";
import CommentThread from "@/components/CommentThread";
import LoadingStateProtected from "@/components/LoadingStateProtected";
import { useUserStore } from "@/stores/userStore";
import {
  CanvassAttachment,
  CanvassDetail,
  CommentType,
  TicketDetailsType,
} from "@/utils/types";
import {
  ActionIcon,
  Alert,
  Avatar,
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
  IconClock,
  IconFile,
  IconFileText,
} from "@tabler/icons-react";
import DOMPurify from "dompurify";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const TicketDetailsPage = () => {
  const { ticket_id } = useParams() as { ticket_id: string };
  const router = useRouter();

  const { user } = useUserStore();
  // const { setComments } = useCommentsStore();
  const { colorScheme } = useMantineColorScheme();

  const [comments, setComments] = useState<CommentType[]>([]);
  const [ticket, setTicket] = useState<TicketDetailsType | null>(null);
  const [canvassDetails, setCanvassDetails] = useState<CanvassDetail[] | null>(
    null
  );
  const [isFormVisible, setIsFormVisible] = useState(true);
  const [isCanvasVisible, setIsCanvasVisible] = useState(true);
  const [loading, setLoading] = useState(true);
  const [canvasLoading, setCanvasLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [cancelRequestOpen, setCancelRequestOpen] = useState(false);

  const [approvalStatus, setApprovalStatus] = useState<string | null>(null);
  const [canvassStartOpen, setCanvassStartOpen] = useState(false);
  const [canvassApprovalOpen, setCanvassApprovalOpen] = useState(false);
  const [newComment, setNewComment] = useState<string>("");
  const [statusLoading, setStatusLoading] = useState(false);

  const userApprovalStatus = ticket?.reviewers.find(
    (reviewer) => reviewer.reviewer_id === user?.user_id
  )?.approval_status;

  const isDisabled =
    userApprovalStatus === "APPROVED" || userApprovalStatus === "REJECTED";

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

  const handleReviewerApproval = async () => {
    if (!user) {
      console.error("User not logged in.");
      return;
    }

    setStatusLoading(true);

    const newApprovalStatus =
      approvalStatus === "APPROVED" ? "APPROVED" : "REJECTED";

    if (!ticket) return;

    // Optimistically update only my approval status
    const updatedReviewers = ticket.reviewers.map((reviewer) =>
      reviewer.reviewer_id === user.user_id
        ? { ...reviewer, approval_status: newApprovalStatus }
        : reviewer
    );

    // Check if all non-managers have approved
    const nonManagerReviewers = updatedReviewers.filter(
      (reviewer) => reviewer.reviewer_role !== "MANAGER"
    );
    const allApproved =
      nonManagerReviewers.length > 0 &&
      nonManagerReviewers.every(
        (reviewer) => reviewer.approval_status === "APPROVED"
      );

    // Only update the ticket status if all reviewers are approved
    const newTicketStatus = allApproved ? "FOR APPROVAL" : ticket.ticket_status;

    setTicket((prev) =>
      prev
        ? {
            ...prev,
            ticket_status: newTicketStatus, // Update status only if all are approved
            reviewers: updatedReviewers, // Always update my approval status
          }
        : null
    );

    try {
      if (newComment.trim()) {
        const commentId = await addComment(
          ticket.ticket_id,
          newComment,
          user.user_id
        );
        setComments([
          ...comments,
          {
            comment_id: commentId,
            comment_ticket_id: ticket_id,
            comment_user_id: user.user_id,
            comment_content: newComment,
            comment_date_created: new Date().toISOString(),
            comment_is_edited: false,
            comment_type: "COMMENT",
            comment_user_full_name: user.user_full_name,
            comment_user_avatar: user?.user_avatar,
            comment_last_updated: new Date().toISOString(),
            replies: [],
          },
        ]);
        setNewComment("");
      }

      await updateApprovalStatus({
        approval_ticket_id: ticket.ticket_id,
        approval_review_status: newApprovalStatus,
        approval_reviewed_by: user.user_id,
      });

      handleCanvassAction(newTicketStatus);
      setCanvassApprovalOpen(false);
      setApprovalStatus(null);
    } catch (error) {
      console.error("Error updating approval:", error);

      // Revert my approval status if API call fails
      setTicket((prev) =>
        prev
          ? {
              ...prev,
              reviewers: prev.reviewers.map((reviewer) =>
                reviewer.reviewer_id === user.user_id
                  ? { ...reviewer, approval_status: "PENDING" } // Reset my approval
                  : reviewer
              ),
            }
          : null
      );
    } finally {
      setStatusLoading(false);
    }
  };

  const handleManagerApproval = async () => {
    if (!user || !isManager) {
      console.error("Only managers can finalize.");
      return;
    }

    setStatusLoading(true);

    if (!ticket) return;

    // Determine new ticket status based on manager's decision
    const newApprovalStatus =
      approvalStatus === "APPROVED" ? "APPROVED" : "REJECTED";
    const newTicketStatus =
      newApprovalStatus === "APPROVED" ? "DONE" : "DECLINED";

    // Update only the manager's approval status
    const updatedReviewers = ticket?.reviewers.map((reviewer) =>
      reviewer.reviewer_id === user.user_id
        ? { ...reviewer, approval_status: newApprovalStatus }
        : reviewer
    );

    // Optimistic UI update
    setTicket((prev) =>
      prev
        ? {
            ...prev,
            ticket_status: newTicketStatus,
            reviewers: updatedReviewers ?? [],
          }
        : null
    );

    try {
      if (newComment.trim()) {
        const commentId = await addComment(
          ticket.ticket_id,
          newComment,
          user.user_id
        );
        setComments([
          ...comments,
          {
            comment_id: commentId,
            comment_ticket_id: ticket_id,
            comment_user_id: user.user_id,
            comment_content: newComment,
            comment_date_created: new Date().toISOString(),
            comment_is_edited: false,
            comment_type: "COMMENT",
            comment_user_full_name: user.user_full_name,
            comment_user_avatar: user?.user_avatar,
            comment_last_updated: new Date().toISOString(),
            replies: [],
          },
        ]);
        setNewComment("");
      }

      await updateApprovalStatus({
        approval_ticket_id: ticket.ticket_id,
        approval_review_status: newApprovalStatus,
        approval_reviewed_by: user.user_id,
      });

      handleCanvassAction(newTicketStatus);
      setCanvassApprovalOpen(false);
      setApprovalStatus(null);
    } catch (error) {
      console.error("Error finalizing approval:", error);

      // Revert UI if API fails
      setTicket((prev) =>
        prev
          ? {
              ...prev,
              ticket_status: "FOR APPROVAL",
              reviewers: prev.reviewers.map((reviewer) =>
                reviewer.reviewer_id === user.user_id
                  ? { ...reviewer, approval_status: "PENDING" }
                  : reviewer
              ),
            }
          : null
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
        const commentId = await addComment(ticket_id, newComment, user.user_id);
        setComments([
          ...comments,
          {
            comment_id: commentId,
            comment_ticket_id: ticket_id,
            comment_user_id: user.user_id,
            comment_content: newComment,
            comment_date_created: new Date().toISOString(),
            comment_is_edited: false,
            comment_type: "COMMENT",
            comment_user_full_name: user.user_full_name,
            comment_user_avatar: user?.user_avatar,
            comment_last_updated: new Date().toISOString(),
            replies: [],
          },
        ]);
        setNewComment("");
      }

      setTicket((prev) =>
        prev ? { ...prev, ticket_status: "WORK IN PROGRESS" } : null
      );

      await handleCanvassAction("WORK IN PROGRESS");

      setCanvassStartOpen(false);
    } catch (error) {
      console.error("Error adding comment or starting canvass:", error);

      setTicket((prev) =>
        prev ? { ...prev, ticket_status: "FOR CANVASS" } : null
      );
    } finally {
      setStatusLoading(false);
    }
  };

  const handleRevision = async () => {
    if (!user || !ticket) {
      console.error("User not logged in or ticket is undefined.");
      return;
    }

    setStatusLoading(true);

    try {
      if (newComment.trim()) {
        // Add comment before reverting approval status
        const commentId = await addComment(
          ticket.ticket_id,
          newComment,
          user.user_id
        );
        setComments((prevComments) => [
          ...prevComments,
          {
            comment_id: commentId,
            comment_ticket_id: ticket.ticket_id,
            comment_user_id: user.user_id,
            comment_content: newComment,
            comment_date_created: new Date().toISOString(),
            comment_is_edited: false,
            comment_type: "COMMENT",
            comment_user_full_name: user.user_full_name,
            comment_user_avatar: user?.user_avatar,
            comment_last_updated: new Date().toISOString(),
            replies: [],
          },
        ]);
        setNewComment(""); // Clear input after posting
      }

      // Revert approval status
      await revertApprovalStatus(ticket.ticket_id);

      // Optimistically update UI
      setTicket((prev) =>
        prev
          ? {
              ...prev,
              ticket_status: "WORK IN PROGRESS",
              reviewers: prev.reviewers.map((reviewer) => ({
                ...reviewer,
                approval_status: "PENDING",
              })),
            }
          : prev
      );

      handleCanvassAction("WORK IN PROGRESS");
    } catch (error) {
      console.error("Error requesting revision:", error);
    } finally {
      setStatusLoading(false);
      setCanvassApprovalOpen(false);
    }
  };

  const handleCancelRequest = async () => {
    if (!user || !ticket) {
      console.error("User not logged in or ticket is undefined.");
      return;
    }

    setStatusLoading(true);

    try {
      if (newComment.trim()) {
        // Add comment before reverting approval status
        const commentId = await addComment(
          ticket.ticket_id,
          newComment,
          user.user_id
        );
        setComments((prevComments) => [
          ...prevComments,
          {
            comment_id: commentId,
            comment_ticket_id: ticket.ticket_id,
            comment_user_id: user.user_id,
            comment_content: newComment,
            comment_date_created: new Date().toISOString(),
            comment_is_edited: false,
            comment_type: "COMMENT",
            comment_user_full_name: user.user_full_name,
            comment_user_avatar: user?.user_avatar,
            comment_last_updated: new Date().toISOString(),
            replies: [],
          },
        ]);
        setNewComment(""); // Clear input after posting
      }

      // Revert approval status
      await revertApprovalStatus(ticket.ticket_id);

      // Optimistically update UI
      setTicket((prev) =>
        prev
          ? {
              ...prev,
              ticket_status: "CANCELED",
              reviewers: prev.reviewers.map((reviewer) => ({
                ...reviewer,
                approval_status: "PENDING",
              })),
            }
          : prev
      );

      handleCanvassAction("CANCELED");
    } catch (error) {
      console.error("Error requesting revision:", error);
    } finally {
      setStatusLoading(false);
      setCanvassApprovalOpen(false);
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
    (u) => u.user_id === user?.user_id
  );
  const isReviewer = ticket.reviewers?.some(
    (r) => r.reviewer_id === user?.user_id
  );
  const isManager = user?.user_role === "MANAGER";

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
      <Stack gap={2} mb="sm">
        <Button
          variant="light"
          onClick={() => router.push("/tickets")}
          leftSection={<IconArrowLeft size={16} />}
          radius="md"
          w="fit-content"
        >
          Back to Tickets
        </Button>
        {/* <Group>
          <Title
            pl={16}
            order={1}
            styles={(theme) => ({
              root: {
                borderLeft: `4px solid ${theme.colors.blue[5]}`,
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
        </Group> */}
      </Stack>

      {/* Main Content Grid */}
      <Grid gutter="lg">
        {/* Left Column */}
        <Grid.Col span={{ base: 12, md: 8 }}>
          <Paper
            radius="lg"
            shadow="sm"
            p="xl"
            withBorder
            style={(theme) => ({
              backgroundColor:
                colorScheme === "dark" ? theme.colors.dark[6] : theme.white,
              borderColor:
                colorScheme === "dark"
                  ? theme.colors.dark[5]
                  : theme.colors.gray[1],
            })}
          >
            {/* Ticket Header */}
            <Group align="center" justify="space-between">
              <Group gap="md">
                <Box pos="relative">
                  <Avatar
                    src={ticket.ticket_created_by_avatar}
                    radius="xl"
                    size={56}
                  />
                </Box>
                <Stack gap={3}>
                  <Text size="xs" fw={600} tt="uppercase" c="dimmed">
                    Raised by
                  </Text>
                  <Text size="lg" fw={700}>
                    {ticket.ticket_created_by_name}
                  </Text>
                  <Group gap={4}>
                    <ThemeIcon size="xs" color="gray" variant="light">
                      <IconClock size={10} />
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
                        }
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
                  size={30}
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
            <Collapse in={isFormVisible}>
              {isFormVisible && (
                <>
                  {/* Ticket Details */}
                  <Grid gutter="lg" mt={`${isFormVisible ? "lg" : 0}`}>
                    {/* Left Column (Main Details + Notes) */}
                    <Grid.Col span={{ base: 12, sm: 6 }}>
                      <Stack gap="lg">
                        {/* RF Date Received */}
                        <Stack gap={4} mt="xs">
                          <Text size="md" c="dimmed" fw={500}>
                            RF Date Received:
                          </Text>
                          <Text fw={500}>
                            {new Date(
                              ticket.ticket_rf_date_received
                            ).toLocaleString("en-US", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })}
                          </Text>
                        </Stack>

                        {/* Item Name */}
                        <Stack gap={4}>
                          <Text size="md" c="dimmed" fw={500}>
                            Item Name:
                          </Text>
                          <Text fw={500}>{ticket.ticket_item_name}</Text>
                        </Stack>

                        {/* Item Description */}
                        <Stack gap={4}>
                          <Text size="md" c="dimmed" fw={500}>
                            Item Description:
                          </Text>
                          <Text fw={500}>{ticket.ticket_item_description}</Text>
                        </Stack>

                        {/* Quantity */}
                        <Stack gap={4}>
                          <Text size="md" c="dimmed" fw={500}>
                            Quantity:
                          </Text>
                          <Text fw={500}>{ticket.ticket_quantity}</Text>
                        </Stack>

                        {/* Notes (Moved Back to Left) */}
                        {ticket.ticket_notes && (
                          <Stack gap={4}>
                            <Text size="md" c="dimmed" fw={500}>
                              Notes:
                            </Text>
                            <Text
                              dangerouslySetInnerHTML={{
                                __html: DOMPurify.sanitize(ticket.ticket_notes),
                              }}
                            />
                          </Stack>
                        )}
                      </Stack>
                    </Grid.Col>

                    {/* Right Column (Specifications Only) */}
                    <Grid.Col span={{ base: 12, sm: 6 }}>
                      <Stack gap="lg">
                        {/* Specifications */}
                        {ticket.ticket_specifications && (
                          <Stack gap={0}>
                            <Text size="md" c="dimmed" fw={500}>
                              Specifications:
                            </Text>
                            <Text
                              dangerouslySetInnerHTML={{
                                __html: DOMPurify.sanitize(
                                  ticket.ticket_specifications
                                ),
                              }}
                            />
                          </Stack>
                        )}
                      </Stack>
                    </Grid.Col>
                  </Grid>

                  {/* Approval Modal */}
                  <Modal
                    opened={canvassApprovalOpen}
                    onClose={() => setCanvassApprovalOpen(false)}
                    title={
                      isManager
                        ? "Finalize Ticket"
                        : `Confirm ${
                            approvalStatus === "APPROVED"
                              ? "Approval"
                              : approvalStatus === "NEEDS_REVISION"
                              ? "Request Revision"
                              : "Decline"
                          }`
                    }
                    centered
                  >
                    <Textarea
                      value={newComment}
                      onChange={(event) => setNewComment(event.target.value)}
                      placeholder="Optional comment..."
                      autosize
                      minRows={3}
                    />

                    <Group mt="md" justify="flex-end">
                      <Button
                        variant="default"
                        onClick={() => setCanvassApprovalOpen(false)}
                      >
                        Cancel
                      </Button>

                      {isManager ? (
                        <Button
                          loading={statusLoading}
                          color={
                            approvalStatus === "APPROVED" ? "green" : "red"
                          }
                          onClick={async () => {
                            setStatusLoading(true);
                            await handleManagerApproval();
                            setCanvassApprovalOpen(false);
                            setStatusLoading(false);
                          }}
                        >
                          {approvalStatus === "APPROVED"
                            ? "Approve"
                            : "Decline"}
                        </Button>
                      ) : (
                        <Button
                          loading={statusLoading}
                          color={
                            approvalStatus === "APPROVED"
                              ? "blue"
                              : approvalStatus === "NEEDS_REVISION"
                              ? "yellow"
                              : "red"
                          }
                          onClick={async () => {
                            setStatusLoading(true);

                            if (approvalStatus === "NEEDS_REVISION") {
                              await handleRevision();
                            } else {
                              await handleReviewerApproval();
                            }

                            setStatusLoading(false);
                            setCanvassApprovalOpen(false);
                          }}
                        >
                          {approvalStatus === "APPROVED"
                            ? "Approve"
                            : approvalStatus === "NEEDS_REVISION"
                            ? "Request Revision"
                            : "Decline"}
                        </Button>
                      )}
                    </Group>
                  </Modal>

                  {/* Start Canvass Modal */}
                  <Modal
                    opened={canvassStartOpen}
                    onClose={() => setCanvassStartOpen(false)}
                    title="Confirm Action"
                    centered
                  >
                    <Textarea
                      value={newComment}
                      onChange={(event) => setNewComment(event.target.value)}
                      placeholder="Optional comment..."
                      autosize
                      minRows={3}
                    />

                    <Group mt="md" justify="flex-end">
                      <Button
                        variant="default"
                        onClick={() => setCanvassStartOpen(false)}
                      >
                        Cancel
                      </Button>

                      <Button
                        color="blue"
                        loading={statusLoading}
                        onClick={async () => {
                          setStatusLoading(true);
                          await handleStartConfirm();
                          setStatusLoading(false);
                          setCanvassStartOpen(false);
                        }}
                      >
                        Start Canvass
                      </Button>
                    </Group>
                  </Modal>
                  <br />

                  {/* Canvass Form Section */}
                  {ticket?.ticket_status !== "FOR CANVASS" && (
                    <>
                      <Divider mb="lg" />
                      <Box
                        onClick={
                          !isCanvasVisible
                            ? () => setIsCanvasVisible(true)
                            : undefined
                        }
                        px="sm"
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
                              } // Click only the header to collapse when open
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
                                <Text fz="lg" fw={600}>
                                  Canvass Form
                                </Text>
                              </Group>

                              <ActionIcon
                                variant="light"
                                color="gray"
                                radius="xl"
                                size={30}
                              >
                                {isCanvasVisible ? (
                                  <IconChevronUp size={18} />
                                ) : (
                                  <IconChevronDown size={18} />
                                )}
                              </ActionIcon>
                            </Group>

                            <Collapse in={isCanvasVisible}>
                              {ticket.ticket_status !== "WORK IN PROGRESS" &&
                              (canvassDetails?.length ?? 0) > 0 ? (
                                <>
                                  {canvassDetails?.map(
                                    (canvass: CanvassDetail) => (
                                      <Box
                                        key={canvass.canvass_form_id}
                                        mb="md"
                                      >
                                        <Grid gutter="lg">
                                          <Grid.Col span={6}>
                                            <Stack gap="xl">
                                              {/* RF Date Received */}
                                              <Stack gap={4}>
                                                <Text
                                                  size="md"
                                                  c="dimmed"
                                                  fw={500}
                                                >
                                                  RF Date Received:
                                                </Text>
                                                <Text fw={500}>
                                                  {new Date(
                                                    canvass.canvass_form_rf_date_received
                                                  ).toLocaleString("en-US", {
                                                    day: "2-digit",
                                                    month: "short",
                                                    year: "numeric",
                                                  })}
                                                </Text>
                                              </Stack>

                                              {/* Lead Time */}
                                              <Stack gap={4}>
                                                <Text
                                                  size="md"
                                                  c="dimmed"
                                                  fw={500}
                                                >
                                                  Lead Time:
                                                </Text>
                                                <Text fw={500}>
                                                  {
                                                    canvass.canvass_form_lead_time_day
                                                  }
                                                </Text>
                                              </Stack>

                                              {/* Payment Terms */}
                                              <Stack gap={4}>
                                                <Text
                                                  size="md"
                                                  c="dimmed"
                                                  fw={500}
                                                >
                                                  Payment Terms:
                                                </Text>
                                                <Text fw={500}>
                                                  {
                                                    canvass.canvass_form_payment_terms
                                                  }
                                                </Text>
                                              </Stack>

                                              {/* Submitted By */}
                                              <Stack gap={4}>
                                                <Text
                                                  size="md"
                                                  c="dimmed"
                                                  fw={500}
                                                >
                                                  Submitted By:
                                                </Text>
                                                <Group gap="md">
                                                  <Avatar
                                                    variant="light"
                                                    radius="xl"
                                                    size="md"
                                                  >
                                                    {canvass.submitted_by.user_full_name?.charAt(
                                                      0
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
                                                        canvass.canvass_form_date_submitted
                                                      ).toLocaleString()}
                                                    </Text>
                                                  </Stack>
                                                </Group>
                                              </Stack>
                                            </Stack>
                                          </Grid.Col>
                                          <Grid.Col span={6}>
                                            <Stack gap="xl">
                                              {/* Recommended Supplier */}
                                              <Stack gap={4}>
                                                <Text
                                                  size="md"
                                                  c="dimmed"
                                                  fw={500}
                                                >
                                                  Recommended Supplier:
                                                </Text>
                                                <Text fw={500}>
                                                  {
                                                    canvass.canvass_form_recommended_supplier
                                                  }
                                                </Text>
                                              </Stack>

                                              {/* Total Amount */}
                                              <Stack gap={4}>
                                                <Text
                                                  size="md"
                                                  c="dimmed"
                                                  fw={500}
                                                >
                                                  Total Amount:
                                                </Text>
                                                <Text fw={500}>
                                                  ₱
                                                  {canvass.canvass_form_total_amount.toFixed(
                                                    2
                                                  )}
                                                </Text>
                                              </Stack>

                                              {/* Canvass Attachments */}
                                              {canvass.attachments.length >
                                                0 && (
                                                <Stack gap={4}>
                                                  <Text
                                                    size="md"
                                                    c="dimmed"
                                                    fw={500}
                                                  >
                                                    Attachments:
                                                  </Text>
                                                  <Group gap="xs">
                                                    {canvass.attachments.map(
                                                      (
                                                        attachment: CanvassAttachment
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
                                                              attachment.canvass_attachment_created_at
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
                                                      )
                                                    )}
                                                  </Group>
                                                </Stack>
                                              )}
                                            </Stack>
                                          </Grid.Col>
                                        </Grid>
                                      </Box>
                                    )
                                  )}
                                </>
                              ) : user?.user_id ===
                                ticket?.ticket_created_by ? (
                                <CanvassForm
                                  ticketId={ticket?.ticket_id}
                                  updateCanvassDetails={fetchCanvassDetails}
                                  setTicket={setTicket}
                                />
                              ) : (
                                <Alert variant="light" color="gray" radius="md">
                                  <Text>
                                    Canvass form is not available yet.
                                  </Text>
                                </Alert>
                              )}
                            </Collapse>
                          </Stack>
                        )}
                      </Box>
                    </>
                  )}
                </>
              )}
            </Collapse>
          </Paper>

          <Paper
            mt="lg"
            radius="lg"
            shadow="sm"
            p="xl"
            withBorder
            style={(theme) => ({
              backgroundColor:
                colorScheme === "dark" ? theme.colors.dark[6] : theme.white,
              borderColor:
                colorScheme === "dark"
                  ? theme.colors.dark[5]
                  : theme.colors.gray[1],
            })}
          >
            <Text mb="md" size="xl" fw={700}>
              Activity
            </Text>
            {/* Comment thread realtime backup */}
            {/* <CommentThread ticket_id={ticket_id}/> */}
            <CommentThread
              ticket_id={ticket_id}
              comments={comments}
              setComments={setComments}
              ticket_status={ticket.ticket_status}
            />
          </Paper>
        </Grid.Col>
        <TicketStatusAndActions
          ticket={ticket}
          statusLoading={statusLoading}
          isDisabled={isDisabled}
          fetchTicketDetails={fetchTicketDetails}
          setCanvassStartOpen={setCanvassStartOpen}
          setApprovalStatus={setApprovalStatus}
          setCanvassApprovalOpen={setCanvassApprovalOpen}
          handleCanvassAction={handleCanvassAction}
        />
      </Grid>
    </Box>
  );
};

export default TicketDetailsPage;
