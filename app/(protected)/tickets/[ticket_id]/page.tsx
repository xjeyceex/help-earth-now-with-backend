"use client";

import {
  getAllUsers,
  getCanvassDetails,
  getComments,
  getTicketDetails,
} from "@/actions/get";
import { addComment, shareTicket, startCanvass } from "@/actions/post";
import { revertApprovalStatus, updateApprovalStatus } from "@/actions/update";
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
  Avatar,
  Badge,
  Box,
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
  Skeleton,
  Stack,
  Text,
  Textarea,
  ThemeIcon,
  Title,
} from "@mantine/core";
import {
  IconArrowLeft,
  IconChevronDown,
  IconChevronUp,
  IconClipboardCheck,
  IconClipboardX,
  IconEdit,
  IconFile,
  IconFileText,
  IconPlus,
  IconShoppingCartFilled,
  IconX,
} from "@tabler/icons-react";
import DOMPurify from "dompurify";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const TicketDetailsPage = () => {
  const { ticket_id } = useParams() as { ticket_id: string };
  const { user } = useUserStore();
  // const { setComments } = useCommentsStore();

  const [comments, setComments] = useState<CommentType[]>([]);
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
  const [isSharingLoading, setIsSharingLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [allUsers, setAllUsers] = useState<{ value: string; label: string }[]>(
    []
  );
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

  const handleShareTicket = async () => {
    if (!selectedUsers.length || !ticket_id) return;

    setIsSharingLoading(true);

    try {
      await Promise.all(
        selectedUsers.map((userId) => shareTicket(ticket_id, userId))
      );

      await fetchTicketDetails();

      setSelectedUsers([]);
      setAllUsers((prev) =>
        prev.filter((user) => !selectedUsers.includes(user.value))
      );
    } catch (error) {
      console.error("Error sharing ticket:", error);
    } finally {
      setIsSharingLoading(false);
      setIsSharing(false);
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
    fetchUsers();
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
    <Container size="xl" py="xl">
      <Flex justify="flex-start" align="center" gap="lg">
        <Link href="/tickets">
          <Button variant="light" leftSection={<IconArrowLeft size={16} />}>
            Go back
          </Button>
        </Link>
      </Flex>
      <Group align="start" grow w="100%">
        <Card shadow="sm" mt="lg" radius="sm" withBorder px={30}>
          <Title ta="left" my={20} fz="h3">
            Ticket Details
          </Title>
          <Flex w="100%" gap="md">
            <Box w="70%">
              <Card shadow="sm" radius="sm" withBorder px={30}>
                <Group justify="space-between">
                  <Group>
                    <Avatar
                      src={ticket.ticket_created_by_avatar}
                      radius="xl"
                      size="md"
                    />
                    <Text size="sm" c="dimmed">
                      <strong>{ticket.ticket_created_by_name}</strong> raised
                      this on{" "}
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

                <Collapse in={isFormVisible}>
                  {isFormVisible && (
                    <>
                      <Box pt="md" px="md">
                        <Stack align="start" px="md" gap="md">
                          <Stack gap="sm">
                            <Text size="md" fw={600} ta="left">
                              RF Date Received:
                            </Text>
                            <Text size="sm">
                              {new Date(
                                ticket.ticket_rf_date_received
                              ).toLocaleString("en-US", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })}
                            </Text>
                          </Stack>
                          <Stack gap="sm">
                            <Text size="md" fw={600} ta="left">
                              Item Name:
                            </Text>
                            <Text size="sm">{ticket.ticket_item_name}</Text>
                          </Stack>
                          <Stack gap="sm">
                            <Text size="md" fw={600} ta="left">
                              Item Description:
                            </Text>
                            <Text size="sm">
                              {ticket.ticket_item_description}
                            </Text>
                          </Stack>
                          <Stack gap="sm">
                            <Text size="md" fw={600} ta="left">
                              Quantity:
                            </Text>
                            <Text size="sm">{ticket.ticket_quantity}</Text>
                          </Stack>
                          <Stack gap="0">
                            <Text size="md" fw={600} ta="left">
                              Specifications:
                            </Text>
                            <Text size="md">
                              <span
                                dangerouslySetInnerHTML={{
                                  __html: DOMPurify.sanitize(
                                    ticket.ticket_specifications
                                  ),
                                }}
                              />
                            </Text>
                          </Stack>
                          <Stack gap="0">
                            <Text size="md" fw={600} ta="left">
                              Notes:
                            </Text>
                            <Text size="md">
                              <span
                                dangerouslySetInnerHTML={{
                                  __html: DOMPurify.sanitize(
                                    ticket.ticket_notes
                                  ),
                                }}
                              />
                            </Text>
                          </Stack>
                        </Stack>
                      </Box>
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
                          onChange={(event) =>
                            setNewComment(event.target.value)
                          }
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
                                setStatusLoading(false);
                                setCanvassApprovalOpen(false);
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
                                  await revertApprovalStatus(ticket.ticket_id);
                                  setTicket((prev) =>
                                    prev
                                      ? {
                                          ...prev,
                                          ticket_status: "WORK IN PROGRESS",
                                          reviewers: prev.reviewers.map(
                                            (reviewer) => ({
                                              ...reviewer,
                                              approval_status: "PENDING",
                                            })
                                          ),
                                        }
                                      : prev
                                  );
                                  handleCanvassAction("WORK IN PROGRESS");
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

                      <Modal
                        opened={canvassStartOpen}
                        onClose={() => setCanvassStartOpen(false)}
                        title="Confirm Action"
                        centered
                      >
                        <Textarea
                          value={newComment}
                          onChange={(event) =>
                            setNewComment(event.target.value)
                          }
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

                      {(isAdmin ||
                        ticket?.ticket_created_by === user?.user_id) && (
                        <>
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
                            <Button
                              onClick={handleShareTicket}
                              mt="md"
                              loading={isSharingLoading}
                              disabled={isSharingLoading}
                            >
                              {isSharingLoading ? "Sharing..." : "Share"}
                            </Button>
                          </Modal>
                        </>
                      )}

                      <br />

                      {ticket?.ticket_status !== "FOR CANVASS" && (
                        <Card
                          shadow="sm"
                          radius="sm"
                          withBorder
                          px={30}
                          style={{
                            cursor: !isCanvasVisible ? "pointer" : "default",
                          }} // Change cursor based on collapse state
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
                                    {canvassDetails?.map(
                                      (canvass: CanvassDetail) => (
                                        <Stack
                                          key={canvass.canvass_form_id}
                                          px="sm"
                                        >
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
                                            <strong>
                                              Recommended Supplier:
                                            </strong>{" "}
                                            {
                                              canvass.canvass_form_recommended_supplier
                                            }
                                          </Text>
                                          <Text>
                                            <strong>Lead Time (days):</strong>{" "}
                                            {canvass.canvass_form_lead_time_day}
                                          </Text>
                                          <Text>
                                            <strong>Total Amount:</strong> ₱
                                            {canvass.canvass_form_total_amount.toFixed(
                                              2
                                            )}
                                          </Text>
                                          {canvass.canvass_form_payment_terms && (
                                            <Text>
                                              <strong>Payment Terms:</strong>{" "}
                                              {
                                                canvass.canvass_form_payment_terms
                                              }
                                            </Text>
                                          )}
                                          <Text>
                                            <strong>Submitted By:</strong>{" "}
                                            {canvass.submitted_by
                                              .user_full_name || "Unknown"}
                                          </Text>
                                          <Text>
                                            <strong>Date Submitted:</strong>{" "}
                                            {new Date(
                                              canvass.canvass_form_date_submitted
                                            ).toLocaleDateString()}
                                          </Text>

                                          {canvass.attachments.length > 0 && (
                                            <div>
                                              <Text fw={600}>Attachments:</Text>
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
                                  <Text p="md" c="dimmed">
                                    Canvass form is not available yet.
                                  </Text>
                                )}
                              </Collapse>
                            </Stack>
                          )}
                        </Card>
                      )}
                    </>
                  )}
                </Collapse>
              </Card>

              <Text size="md" mt="xl" fw="500">
                {" "}
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
            </Box>
            <Box w="30%" p="md">
              <Stack align="start" px="md">
                <Stack gap="sm">
                  <Group gap="xs" align="center" wrap="nowrap">
                    <Text size="sm" fw={600} ta="left">
                      Ticket Status:
                    </Text>
                  </Group>

                  {statusLoading ? (
                    <Skeleton height={24} width={120} radius="sm" />
                  ) : (
                    <Badge
                      color={
                        ticket?.ticket_status === "FOR REVIEW OF SUBMISSIONS"
                          ? "yellow"
                          : ticket?.ticket_status === "FOR APPROVAL"
                          ? "yellow"
                          : ticket?.ticket_status === "WORK IN PROGRESS"
                          ? "blue"
                          : ticket?.ticket_status === "DONE"
                          ? "green"
                          : ticket?.ticket_status === "DECLINED"
                          ? "red"
                          : "gray"
                      }
                      size="md"
                      variant="filled"
                      radius="sm"
                    >
                      {ticket?.ticket_status}
                    </Badge>
                  )}
                </Stack>

                {/* Actions */}
                {!(
                  ticket?.ticket_status === "CANCELED" ||
                  ticket?.ticket_status === "DONE" ||
                  ticket?.ticket_status === "DECLINED"
                ) && (
                  <>
                    <Group gap="xs" align="center" wrap="nowrap">
                      <Text size="sm" fw={600} ta="left">
                        Actions:
                      </Text>
                    </Group>
                    <Stack gap="md">
                      {ticket?.ticket_status === "FOR CANVASS" && isCreator && (
                        <Group
                          gap="sm"
                          align="center"
                          wrap="nowrap"
                          style={{
                            cursor: "pointer",
                            transition: "transform 0.2s ease",
                            borderRadius: "4px",
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.backgroundColor = "gray")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.backgroundColor =
                              "transparent")
                          }
                          onClick={() => setCanvassStartOpen(true)} // Open the modal first
                        >
                          <IconClipboardCheck size={18} />
                          <Text size="sm" fw={600}>
                            Start Canvass
                          </Text>
                        </Group>
                      )}

                      {ticket?.ticket_status === "FOR REVIEW OF SUBMISSIONS" &&
                        isReviewer &&
                        user?.user_role !== "MANAGER" && (
                          <>
                            {[
                              {
                                status: "APPROVED",
                                label: "Approve",
                                Icon: IconClipboardCheck,
                              },
                              {
                                status: "DECLINED",
                                label: "Decline",
                                Icon: IconClipboardX,
                              },
                              {
                                status: "NEEDS_REVISION",
                                label: "Needs Revision",
                                Icon: IconEdit,
                              },
                            ].map(({ status, label, Icon }) => (
                              <Group
                                key={status}
                                gap="sm"
                                align="center"
                                wrap="nowrap"
                                style={{
                                  cursor: isDisabled
                                    ? "not-allowed"
                                    : "pointer",
                                  opacity: isDisabled ? 0.5 : 1, // Dim the buttons if disabled
                                  transition: "transform 0.2s ease",
                                  borderRadius: "4px",
                                }}
                                onMouseEnter={(e) => {
                                  if (!isDisabled)
                                    e.currentTarget.style.backgroundColor =
                                      "gray";
                                }}
                                onMouseLeave={(e) => {
                                  if (!isDisabled)
                                    e.currentTarget.style.backgroundColor =
                                      "transparent";
                                }}
                                onClick={() => {
                                  if (isDisabled) return;
                                  setApprovalStatus(status);
                                  setCanvassApprovalOpen(true);
                                }}
                              >
                                <Icon size={18} />
                                <Text size="sm" fw={600}>
                                  {label}
                                </Text>
                              </Group>
                            ))}
                          </>
                        )}

                      {ticket?.ticket_status === "FOR APPROVAL" &&
                        isManager && (
                          <>
                            {[
                              {
                                status: "APPROVED",
                                label: "Approve",
                                Icon: IconClipboardCheck,
                              },
                              {
                                status: "DECLINED",
                                label: "Decline",
                                Icon: IconClipboardX,
                              },
                            ].map(({ status, label, Icon }) => (
                              <Group
                                key={status}
                                gap="sm"
                                align="center"
                                wrap="nowrap"
                                style={{
                                  cursor: "pointer",
                                  transition: "transform 0.2s ease",
                                  borderRadius: "4px",
                                }}
                                onMouseEnter={(e) =>
                                  (e.currentTarget.style.backgroundColor =
                                    "gray")
                                }
                                onMouseLeave={(e) =>
                                  (e.currentTarget.style.backgroundColor =
                                    "transparent")
                                }
                                onClick={() => {
                                  setApprovalStatus(status);
                                  setCanvassApprovalOpen(true);
                                }}
                              >
                                <Icon size={18} />
                                <Text size="sm" fw={600}>
                                  {label}
                                </Text>
                              </Group>
                            ))}
                          </>
                        )}

                      <Group
                        gap="sm"
                        pr="xs"
                        align="center"
                        wrap="nowrap"
                        style={{
                          cursor: "pointer",
                          transition: "transform 0.2s ease",
                          borderRadius: "4px",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.backgroundColor = "gray")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.backgroundColor =
                            "transparent")
                        }
                        onClick={() => handleCanvassAction("CANCELED")}
                      >
                        <IconX size={18} />
                        <Text size="sm" fw={600}>
                          Cancel Request
                        </Text>
                      </Group>
                    </Stack>
                  </>
                )}

                <Stack gap="sm">
                  <Text size="sm" fw={600}>
                    Request type:
                  </Text>
                  <Group gap="xs">
                    <ThemeIcon size="sm" variant="transparent" color="inherit">
                      <IconShoppingCartFilled size={16} />
                    </ThemeIcon>
                    <Text size="sm">Sourcing</Text>
                  </Group>
                </Stack>
                {statusLoading ? (
                  <Skeleton height={24} width={120} radius="sm" />
                ) : (
                  <Stack gap="sm">
                    {ticket.reviewers.length > 0 ? (
                      <>
                        {/* Regular Reviewers Section */}
                        {ticket.reviewers.some(
                          (reviewer) => reviewer.reviewer_role !== "MANAGER"
                        ) && (
                          <>
                            <Text size="sm" fw={600}>
                              Reviewer(s):
                            </Text>
                            {ticket.reviewers
                              .filter(
                                (reviewer) =>
                                  reviewer.reviewer_role !== "MANAGER"
                              )
                              .map((reviewer) => (
                                <Group key={reviewer.reviewer_id} gap="xs">
                                  <Avatar
                                    src={reviewer.reviewer_avatar}
                                    radius="xl"
                                    size="sm"
                                  />
                                  <Text size="sm">
                                    {reviewer.reviewer_name}
                                  </Text>
                                  <Badge
                                    color={
                                      reviewer.approval_status === "APPROVED"
                                        ? "green"
                                        : reviewer.approval_status ===
                                          "REJECTED"
                                        ? "red"
                                        : "gray"
                                    }
                                    size="xs"
                                  >
                                    {reviewer.approval_status}
                                  </Badge>
                                </Group>
                              ))}
                          </>
                        )}
                        {/* Managers Section */}
                        {ticket.reviewers.some(
                          (reviewer) => reviewer.reviewer_role === "MANAGER"
                        ) && (
                          <>
                            <Text size="sm" fw={600}>
                              Manager(s):
                            </Text>
                            {ticket.reviewers
                              .filter(
                                (reviewer) =>
                                  reviewer.reviewer_role === "MANAGER"
                              )
                              .map((manager) => (
                                <Group key={manager.reviewer_id} gap="xs">
                                  <Avatar
                                    src={manager.reviewer_avatar}
                                    radius="xl"
                                    size="sm"
                                  />
                                  <Text size="sm">{manager.reviewer_name}</Text>
                                  <Badge
                                    color={
                                      manager.approval_status === "APPROVED"
                                        ? "green"
                                        : manager.approval_status === "REJECTED"
                                        ? "red"
                                        : "gray"
                                    }
                                    size="xs"
                                  >
                                    {manager.approval_status}
                                  </Badge>
                                </Group>
                              ))}
                          </>
                        )}
                      </>
                    ) : (
                      <Text size="sm" c="dimmed">
                        No reviewers assigned
                      </Text>
                    )}
                  </Stack>
                )}
                {/* Shared With */}
                <Stack gap="sm">
                  <Group gap="xs" align="center" wrap="nowrap">
                    <Text size="sm" fw={600} ta="left">
                      Shared With:
                    </Text>
                  </Group>

                  <Stack gap="sm">
                    {/* Display ticket creator at the top */}
                    <Group gap="xs" align="center" wrap="nowrap">
                      <Avatar
                        src={ticket.ticket_created_by_avatar}
                        radius="xl"
                        size="sm"
                      />
                      <Text size="sm">{ticket.ticket_created_by_name}</Text>
                      <Text size="xs" p="0" c="dimmed">
                        (Creator)
                      </Text>
                    </Group>

                    {/* Show loading state while sharing */}
                    {isSharingLoading ? (
                      <Stack gap="sm">
                        <Skeleton height={20} width={150} />
                        <Skeleton height={20} width={200} />
                      </Stack>
                    ) : ticket.shared_users.length > 0 ? (
                      ticket.shared_users.map((u) => (
                        <Group
                          key={u.user_id}
                          gap="xs"
                          align="center"
                          wrap="nowrap"
                        >
                          <Avatar src={u.user_avatar} radius="xl" size="sm" />
                          <Text size="sm">{u.user_full_name}</Text>
                        </Group>
                      ))
                    ) : (
                      <Text size="sm" c="dimmed">
                        No shared users yet.
                      </Text>
                    )}
                  </Stack>
                </Stack>

                {/* Share Button */}
                {isCreator && (
                  <Button
                    mt="sm"
                    size="xs"
                    variant="light"
                    leftSection={<IconPlus size={18} />}
                    onClick={() => setIsSharing(true)}
                  >
                    <Text size="sm" fw={600}>
                      Share Ticket
                    </Text>
                  </Button>
                )}
              </Stack>
            </Box>
          </Flex>
        </Card>
      </Group>
    </Container>
  );
};

export default TicketDetailsPage;
