"use client";

import { useUserStore } from "@/stores/userStore";
import { TicketDetailsType } from "@/utils/types";
import {
  Avatar,
  Badge,
  Box,
  Button,
  Group,
  Skeleton,
  Stack,
  Text,
  ThemeIcon,
} from "@mantine/core";
import {
  IconClipboardCheck,
  IconClipboardX,
  IconEdit,
  IconPlus,
  IconShoppingCartFilled,
  IconX,
} from "@tabler/icons-react";

type Props = {
  ticket: TicketDetailsType;
  statusLoading: boolean;
  isDisabled: boolean;
  isSharingLoading: boolean;
  setCanvassStartOpen: (open: boolean) => void;
  setApprovalStatus: (status: string) => void;
  setCanvassApprovalOpen: (open: boolean) => void;
  handleCanvassAction: (action: string) => void;
  setIsSharing: (open: boolean) => void;
};

const TicketStatusAndActions = ({
  ticket,
  statusLoading,
  isDisabled,
  isSharingLoading,
  setCanvassStartOpen,
  setApprovalStatus,
  setCanvassApprovalOpen,
  handleCanvassAction,
  setIsSharing,
}: Props) => {
  const { user } = useUserStore();

  const isReviewer = ticket.reviewers?.some(
    (r) => r.reviewer_id === user?.user_id
  );
  const isManager = user?.user_role === "MANAGER";
  const isCreator = ticket.ticket_created_by === user?.user_id;

  return (
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
                    (e.currentTarget.style.backgroundColor = "transparent")
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
                          cursor: isDisabled ? "not-allowed" : "pointer",
                          opacity: isDisabled ? 0.5 : 1, // Dim the buttons if disabled
                          transition: "transform 0.2s ease",
                          borderRadius: "4px",
                        }}
                        onMouseEnter={(e) => {
                          if (!isDisabled)
                            e.currentTarget.style.backgroundColor = "gray";
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

              {ticket?.ticket_status === "FOR APPROVAL" && isManager && (
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
                        (e.currentTarget.style.backgroundColor = "gray")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = "transparent")
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
                  (e.currentTarget.style.backgroundColor = "transparent")
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
                        (reviewer) => reviewer.reviewer_role !== "MANAGER"
                      )
                      .map((reviewer) => (
                        <Group key={reviewer.reviewer_id} gap="xs">
                          <Avatar
                            src={reviewer.reviewer_avatar}
                            radius="xl"
                            size="sm"
                          />
                          <Text size="sm">{reviewer.reviewer_name}</Text>
                          <Badge
                            color={
                              reviewer.approval_status === "APPROVED"
                                ? "green"
                                : reviewer.approval_status === "REJECTED"
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
                        (reviewer) => reviewer.reviewer_role === "MANAGER"
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
                <Group key={u.user_id} gap="xs" align="center" wrap="nowrap">
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
  );
};

export default TicketStatusAndActions;
