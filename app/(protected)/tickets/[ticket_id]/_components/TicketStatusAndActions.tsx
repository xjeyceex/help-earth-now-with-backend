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
  SimpleGrid,
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
import Link from "next/link";
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
        <Stack>
          {/* Status Section */}
          <Box>
            <Text size="md" fw={500} c="dimmed" mb="sm">
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
              <Text size="md" fw={500} c="dimmed" mb="sm">
                Actions
              </Text>
              <Stack gap="sm">
                {ticket?.ticket_status === "FOR CANVASS" && isCreator && (
                  <Group grow style={{ width: "100%" }}>
                    <Button
                      leftSection={<IconClipboardCheck size={18} />}
                      radius="md"
                      variant="light"
                      color="blue"
                      style={{ flex: 1 }} // Takes full width when alone
                      onClick={() => setCanvassStartOpen(true)}
                    >
                      Start Canvass
                    </Button>
                  </Group>
                )}

                {ticket?.ticket_status === "FOR REVIEW OF SUBMISSIONS" &&
                  isReviewer &&
                  user?.user_role !== "MANAGER" && (
                    <Group grow style={{ width: "100%" }}>
                      <Button
                        leftSection={<IconClipboardCheck size={18} />}
                        radius="md"
                        color="teal"
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
                        disabled={isDisabled}
                        onClick={() => {
                          setApprovalStatus("NEEDS_REVISION");
                          setCanvassApprovalOpen(true);
                        }}
                      >
                        Needs Revision
                      </Button>
                    </Group>
                  )}

                {ticket?.ticket_status === "FOR APPROVAL" && isManager && (
                  <Group grow style={{ width: "100%" }}>
                    <Button
                      leftSection={<IconClipboardCheck size={18} />}
                      radius="md"
                      color="teal"
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
                      onClick={() => {
                        setApprovalStatus("DECLINED");
                        setCanvassApprovalOpen(true);
                      }}
                    >
                      Decline
                    </Button>
                  </Group>
                )}
                <Group grow style={{ width: "100%" }}>
                  <Button
                    variant="light"
                    color="red"
                    leftSection={<IconX size={18} />}
                    radius="md"
                    style={{ flex: 1 }} // Takes full width when alone
                    onClick={() => handleCanvassAction("CANCELED")}
                  >
                    Cancel Request
                  </Button>
                </Group>
              </Stack>
            </Box>
          )}

          <Divider />

          {/* Request Info Section */}
          <Box>
            <Text size="md" fw={500} c="dimmed" mb="sm">
              Request Type
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
              <Text size="md" fw={500} c="dimmed" mb="sm">
                Reviewers
              </Text>
              <Stack gap="md">
                {/* Managers First */}
                {ticket.reviewers
                  .filter((reviewer) => reviewer.reviewer_role === "MANAGER")
                  .map((manager) => (
                    <Group
                      key={manager.reviewer_id}
                      align="center"
                      justify="space-between"
                    >
                      <Flex gap="xs" align="center">
                        <Link href={`/profile/${manager.reviewer_id}`} passHref>
                          <Avatar
                            src={manager.reviewer_avatar}
                            radius="xl"
                            size="md"
                          />
                        </Link>
                        <Stack gap={2}>
                          <Text size="sm" fw={500}>
                            {manager.reviewer_name}
                          </Text>
                          <Text size="xs" c="dimmed">
                            Manager
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
                        <Link
                          href={`/profile/${reviewer.reviewer_id}`}
                          passHref
                        >
                          <Avatar
                            src={reviewer.reviewer_avatar}
                            radius="xl"
                            size="md"
                          />
                        </Link>
                        <Stack gap={2}>
                          <Text size="sm" fw={500}>
                            {reviewer.reviewer_name}
                          </Text>
                          <Text size="xs" c="dimmed">
                            Reviewer
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
              </Stack>
            </Box>
          )}

          <Divider />

          {/* Shared with Section */}
          <Box>
            <Group justify="space-between" mb="sm">
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

            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="sm">
              {/* Creator */}
              <Group gap="xs" align="center">
                <Avatar
                  src={ticket.ticket_created_by_avatar}
                  radius="xl"
                  size="sm"
                />
                <Stack gap={2} align="flex-start">
                  <Text size="xs" fw={500}>
                    {ticket.ticket_created_by_name}
                  </Text>
                  <Text size="xs" c="dimmed">
                    Creator
                  </Text>
                </Stack>
              </Group>

              {/* Shared Users */}
              {isSharingLoading ? (
                <Stack gap="sm">
                  <Skeleton height={32} radius="xl" />
                  <Skeleton height={32} radius="xl" />
                </Stack>
              ) : (
                <>
                  {ticket.shared_users.map((user) => (
                    <Group key={user.user_id} gap="xs" align="center">
                      <Link href={`/profile/${user.user_id}`} passHref>
                        <Avatar src={user.user_avatar} radius="xl" size="sm" />
                      </Link>
                      <Text size="xs" fw={500}>
                        {user.user_full_name}
                      </Text>
                    </Group>
                  ))}
                </>
              )}
            </SimpleGrid>
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
