"use client";

import { getAllUsers } from "@/actions/get";
import { shareTicket } from "@/actions/post";
import { useUserStore } from "@/stores/userStore";
import { TicketDetailsType } from "@/utils/types";
import {
  ActionIcon,
  Avatar,
  Badge,
  Box,
  Button,
  Divider,
  Flex,
  Grid,
  Group,
  Modal,
  MultiSelect,
  Paper,
  Skeleton,
  Stack,
  Text,
  ThemeIcon,
  Tooltip,
  useMantineColorScheme,
} from "@mantine/core";
import {
  IconClipboardCheck,
  IconClipboardX,
  IconEdit,
  IconPlus,
  IconShoppingCartFilled,
  IconX,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";

type Props = {
  ticket: TicketDetailsType;
  statusLoading: boolean;
  isDisabled: boolean;
  setCanvassStartOpen: (open: boolean) => void;
  setApprovalStatus: (status: string) => void;
  setCanvassApprovalOpen: (open: boolean) => void;
  handleCanvassAction: (action: string) => void;
  fetchTicketDetails: () => Promise<void>;
};

const TicketStatusAndActions = ({
  ticket,
  statusLoading,
  isDisabled,
  setCanvassStartOpen,
  fetchTicketDetails,
  setApprovalStatus,
  setCanvassApprovalOpen,
  handleCanvassAction,
}: Props) => {
  const { user } = useUserStore();

  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [isSharing, setIsSharing] = useState(false);
  const [isSharingLoading, setIsSharingLoading] = useState(false);

  const [allUsers, setAllUsers] = useState<{ value: string; label: string }[]>(
    []
  );

  const { colorScheme } = useMantineColorScheme();

  const fetchUsers = async () => {
    const users = await getAllUsers(ticket.ticket_id);

    if ("error" in users) {
      console.error(users.message);
      return;
    }

    setAllUsers(users);
  };

  const isAdmin = user?.user_role === "ADMIN";
  const isReviewer = ticket.reviewers?.some(
    (r) => r.reviewer_id === user?.user_id
  );
  const isManager = user?.user_role === "MANAGER";
  const isCreator = ticket.ticket_created_by === user?.user_id;

  const handleShareTicket = async () => {
    if (!selectedUsers.length || !ticket.ticket_id) return;

    setIsSharingLoading(true);

    try {
      await Promise.all(
        selectedUsers.map((userId) => shareTicket(ticket.ticket_id, userId))
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

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <Grid.Col span={{ base: 12, md: 4 }}>
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
                    : ticket?.ticket_status === "FOR APPROVAL"
                    ? "yellow"
                    : ticket?.ticket_status === "WORK IN PROGRESS"
                    ? "blue"
                    : ticket?.ticket_status === "DONE"
                    ? "teal"
                    : ticket?.ticket_status === "DECLINED"
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
          {!(
            ticket?.ticket_status === "CANCELED" ||
            ticket?.ticket_status === "DONE" ||
            ticket?.ticket_status === "DECLINED"
          ) && (
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
                  isReviewer &&
                  user?.user_role !== "MANAGER" && (
                    <>
                      <Button
                        leftSection={<IconClipboardCheck size={18} />}
                        radius="md"
                        color="teal"
                        fullWidth
                        disabled={isDisabled}
                        onClick={() => {
                          setApprovalStatus("APPROVED");
                          setCanvassApprovalOpen(true);
                        }}
                      >
                        Approve
                      </Button>
                      <Button
                        leftSection={<IconEdit size={18} />}
                        radius="md"
                        color="yellow"
                        variant="light"
                        fullWidth
                        disabled={isDisabled}
                        onClick={() => {
                          setApprovalStatus("NEEDS_REVISION");
                          setCanvassApprovalOpen(true);
                        }}
                      >
                        Needs Revision
                      </Button>
                    </>
                  )}

                {ticket?.ticket_status === "FOR APPROVAL" && isManager && (
                  <>
                    <Button
                      leftSection={<IconClipboardCheck size={18} />}
                      radius="md"
                      color="teal"
                      fullWidth
                      onClick={() => {
                        setApprovalStatus("APPROVED");
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

          {/* Reviewers Section */}
          {!statusLoading && ticket.reviewers.length > 0 && (
            <Box>
              <Text size="md" fw={500} c="dimmed" mb="md">
                Reviewers
              </Text>
              <Stack gap="md">
                {/* Regular Reviewers */}
                {ticket.reviewers
                  .filter((reviewer) => reviewer.reviewer_role !== "MANAGER")
                  .map((reviewer) => (
                    <Group
                      key={reviewer.reviewer_id}
                      align="center"
                      justify="space-between"
                    >
                      <Flex gap="xs" align="center">
                        <Avatar
                          src={reviewer.reviewer_avatar}
                          radius="xl"
                          size="md"
                        />
                        <Stack gap={2}>
                          <Text size="sm" fw={500}>
                            {reviewer.reviewer_name}
                          </Text>
                        </Stack>
                      </Flex>

                      <Badge
                        size="sm"
                        color={
                          reviewer.approval_status === "APPROVED"
                            ? "green"
                            : reviewer.approval_status === "REJECTED"
                            ? "red"
                            : "gray"
                        }
                      >
                        {reviewer.approval_status}
                      </Badge>
                    </Group>
                  ))}

                {/* Managers */}
                {ticket.reviewers.some(
                  (reviewer) => reviewer.reviewer_role === "MANAGER"
                ) && (
                  <>
                    <Text fw={500} size="md" mt="md" c="dimmed">
                      Managers
                    </Text>
                    {ticket.reviewers
                      .filter(
                        (reviewer) => reviewer.reviewer_role === "MANAGER"
                      )
                      .map((manager) => (
                        <Group
                          key={manager.reviewer_id}
                          align="center"
                          justify="space-between"
                        >
                          <Flex gap="xs" align="center">
                            <Avatar
                              src={manager.reviewer_avatar}
                              radius="xl"
                              size="md"
                            />
                            <Stack gap={2}>
                              <Text size="sm" fw={500}>
                                {manager.reviewer_name}
                              </Text>
                            </Stack>
                          </Flex>

                          <Badge
                            size="sm"
                            color={
                              manager.approval_status === "APPROVED"
                                ? "green"
                                : manager.approval_status === "REJECTED"
                                ? "red"
                                : "gray"
                            }
                          >
                            {manager.approval_status}
                          </Badge>
                        </Group>
                      ))}
                  </>
                )}
              </Stack>
            </Box>
          )}

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
              {/* Creator */}
              <Group gap="xs">
                <Avatar
                  src={ticket.ticket_created_by_avatar}
                  radius="xl"
                  size="md"
                />
                <Stack gap={4}>
                  <Text size="sm" fw={500}>
                    {ticket.ticket_created_by_name}
                  </Text>
                  <Badge size="xs">Creator</Badge>
                </Stack>
              </Group>

              {/* Shared Users */}
              {isSharingLoading ? (
                <Stack gap="sm">
                  <Skeleton height={40} radius="md" />
                  <Skeleton height={40} radius="md" />
                </Stack>
              ) : (
                ticket.shared_users.map((user) => (
                  <Box key={user.user_id}>
                    <Divider my="xs" />
                    <Group key={user.user_id}>
                      <Avatar src={user.user_avatar} radius="xl" size="md" />
                      <Text size="sm" fw={500}>
                        {user.user_full_name}
                      </Text>
                    </Group>
                  </Box>
                ))
              )}

              {!isSharingLoading && ticket.shared_users.length === 0 && (
                <Text c="dimmed" size="sm" pt="md">
                  No one has been shared with yet
                </Text>
              )}
            </Stack>
          </Box>
        </Stack>
      </Paper>

      {/* Share Modal */}
      {(isAdmin || isCreator) && (
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
      )}
    </Grid.Col>
  );
};

export default TicketStatusAndActions;
