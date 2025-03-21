"use client";

import { getAllMyTickets } from "@/actions/get";
import LoadingStateProtected from "@/components/LoadingStateProtected";
import { useUserStore } from "@/stores/userStore";
import { MyTicketType } from "@/utils/types";
import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Group,
  Menu,
  Paper,
  Tabs,
  Text,
  ThemeIcon,
  Title,
  Tooltip,
  useMantineColorScheme,
} from "@mantine/core";
import {
  IconChecks,
  IconChevronRight,
  IconFilter,
  IconPlus,
  IconRefresh,
  IconTicket,
} from "@tabler/icons-react";
import moment from "moment";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const getStatusColor = (status: string) => {
  switch (status) {
    case "FOR CANVASS":
      return "indigo.6";
    case "WORK IN PROGRESS":
      return "blue.6";
    case "FOR REVIEW":
    case "IN REVIEW":
    case "FOR REVIEW OF SUBMISSIONS":
      return "violet.6";
    case "FOR APPROVAL":
      return "teal.6";
    case "DONE":
      return "green.6";
    case "CANCELED":
      return "red.7";
    default:
      return "gray.6";
  }
};

type TicketStatus =
  | "FOR CANVASS"
  | "WORK IN PROGRESS"
  | "FOR REVIEW"
  | "IN REVIEW"
  | "FOR APPROVAL"
  | "DONE"
  | "CANCELED"
  | "FOR REVIEW OF SUBMISSIONS"
  | "CANCELED"
  | "all";

const TicketList = () => {
  const { colorScheme } = useMantineColorScheme();
  const { user } = useUserStore();
  const [activeTab, setActiveTab] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest");
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

  useEffect(() => {
    fetchTickets();
  }, [user?.user_id]);

  const tabItems: { value: TicketStatus; label: string }[] = [
    { value: "all", label: "All" },
    { value: "FOR CANVASS", label: "For Canvass" },
    { value: "WORK IN PROGRESS", label: "Work in Progress" },
    { value: "FOR REVIEW", label: "For Review" },
    { value: "FOR REVIEW OF SUBMISSIONS", label: "For Review of Submissions" },
    { value: "IN REVIEW", label: "In Review" },
    { value: "FOR APPROVAL", label: "For Approval" },
    { value: "CANCELED", label: "Canceled" },
    { value: "DONE", label: "Done" },
  ];

  const handleTabChange = (value: string | null) => {
    if (value) {
      setActiveTab(value as TicketStatus);
    }
  };

  // Get available tickets based on user role
  const availableTickets = tickets.filter((ticket) => {
    const isPurchaser = user?.user_role === "PURCHASER";
    const isSharedWithUser = ticket.shared_users?.some(
      (sharedUser) => sharedUser === user?.user_id
    );
    const isTicketOwner = ticket.ticket_created_by === user?.user_id;

    if (isPurchaser && !(isSharedWithUser || isTicketOwner)) {
      return false;
    }

    return true;
  });

  // Count tickets by status
  const getTicketCountByStatus = (status: TicketStatus) => {
    if (status === "all") {
      return availableTickets.length;
    }
    return availableTickets.filter((ticket) => ticket.ticket_status === status)
      .length;
  };

  // Filter and sort tickets based on active tab and sort preference
  const filteredTickets = availableTickets
    .filter((ticket) => {
      if (activeTab !== "all" && ticket.ticket_status !== activeTab) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      const dateA = new Date(a.ticket_date_created).getTime();
      const dateB = new Date(b.ticket_date_created).getTime();
      return sortBy === "newest" ? dateB - dateA : dateA - dateB;
    });

  if (!user || loading) {
    return <LoadingStateProtected />;
  }

  return (
    <Box p={{ base: "md", sm: "xl" }}>
      <Paper
        shadow="xs"
        radius="md"
        style={(theme) => ({
          backgroundColor:
            colorScheme === "dark" ? theme.colors.dark[6] : theme.white,
          border: `1px solid ${
            colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[2]
          }`,
        })}
      >
        <Box p="lg">
          <Group justify="space-between" align="center" mb="lg">
            <Group gap="xs">
              <Title order={2}>Tickets</Title>
              <Badge size="lg" variant="light">
                {availableTickets.length} total
              </Badge>
            </Group>

            <Group gap="sm">
              <Menu shadow="md" width={200} position="bottom-end">
                <Menu.Target>
                  <Button
                    variant="light"
                    size="sm"
                    leftSection={<IconFilter size={16} />}
                  >
                    {sortBy === "newest" ? "Newest First" : "Oldest First"}
                  </Button>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item
                    onClick={() => setSortBy("newest")}
                    leftSection={
                      <IconChecks
                        size={16}
                        opacity={sortBy === "newest" ? 1 : 0}
                      />
                    }
                  >
                    Newest First
                  </Menu.Item>
                  <Menu.Item
                    onClick={() => setSortBy("oldest")}
                    leftSection={
                      <IconChecks
                        size={16}
                        opacity={sortBy === "oldest" ? 1 : 0}
                      />
                    }
                  >
                    Oldest First
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>

              <Tooltip label="Refresh">
                <ActionIcon
                  variant="light"
                  size="lg"
                  onClick={fetchTickets}
                  loading={loading}
                >
                  <IconRefresh size={18} />
                </ActionIcon>
              </Tooltip>

              {user.user_role === "PURCHASER" && (
                <Button
                  leftSection={<IconPlus size={16} />}
                  onClick={() => router.push("/tickets/create-ticket")}
                >
                  New Ticket
                </Button>
              )}
            </Group>
          </Group>

          <Tabs value={activeTab} onChange={handleTabChange}>
            <Tabs.List>
              {tabItems.map((tab) => (
                <Tabs.Tab
                  key={tab.value}
                  value={tab.value}
                  color={
                    tab.value !== "all" ? getStatusColor(tab.value) : undefined
                  }
                >
                  <Group gap={8}>
                    {tab.label}
                    <Badge
                      size="sm"
                      variant="filled"
                      color={
                        tab.value !== "all"
                          ? getStatusColor(tab.value)
                          : undefined
                      }
                    >
                      {getTicketCountByStatus(tab.value)}
                    </Badge>
                  </Group>
                </Tabs.Tab>
              ))}
            </Tabs.List>
          </Tabs>
        </Box>

        {filteredTickets.length > 0 ? (
          filteredTickets.map((ticket) => (
            <Box
              key={ticket.ticket_id}
              p="lg"
              style={(theme) => ({
                borderTop: `1px solid ${
                  colorScheme === "dark"
                    ? theme.colors.dark[4]
                    : theme.colors.gray[2]
                }`,
              })}
            >
              <Group justify="space-between" wrap="nowrap">
                <Box style={{ flex: 1 }}>
                  <Group mb={8}>
                    <Badge
                      variant="light"
                      color={getStatusColor(ticket.ticket_status)}
                    >
                      {ticket.ticket_status}
                    </Badge>
                    <Text size="xs" c="dimmed">
                      Created{" "}
                      {moment(ticket.ticket_date_created).format(
                        "MMM D, YYYY [at] h:mm A"
                      )}
                    </Text>
                  </Group>
                  <Group gap="xs" mb={4}>
                    <Text fw={500} size="sm">
                      #{ticket.ticket_id}
                    </Text>
                    <Text size="sm">{ticket.ticket_item_description}</Text>
                  </Group>
                </Box>
                <Button
                  component={Link}
                  href={`/tickets/${ticket.ticket_id}`}
                  variant="light"
                  size="xs"
                  rightSection={<IconChevronRight size={14} />}
                >
                  View Details
                </Button>
              </Group>
            </Box>
          ))
        ) : (
          <Box p="xl">
            <Group justify="center">
              <ThemeIcon size={48} radius="xl" variant="light" color="gray">
                <IconTicket size={24} />
              </ThemeIcon>
            </Group>
            <Text c="dimmed" ta="center" mt="md">
              No tickets found
            </Text>
            {user.user_role === "PURCHASER" && (
              <Group justify="center" mt="md">
                <Button
                  variant="light"
                  size="sm"
                  onClick={() => router.push("/tickets/create-ticket")}
                  leftSection={<IconPlus size={14} />}
                >
                  Create New Ticket
                </Button>
              </Group>
            )}
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default TicketList;
