"use client";

import { getAllUsers } from "@/actions/get";
import { shareTicket } from "@/actions/post";
import {
  Button,
  Group,
  Modal,
  MultiSelect,
  Stack,
  Text,
  ThemeIcon,
} from "@mantine/core";
import { IconUserPlus } from "@tabler/icons-react";
import { useEffect, useState } from "react";

type ShareTicketModalProps = {
  isOpen: boolean;
  onClose: () => void;
  ticketId: string;
  updateTicketDetails: () => void;
};

const ShareTicketModal = ({
  isOpen,
  onClose,
  ticketId,
  updateTicketDetails,
}: ShareTicketModalProps) => {
  const [allUsers, setAllUsers] = useState<{ value: string; label: string }[]>(
    []
  );
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const handleShareTicket = async () => {
    if (!selectedUsers.length || !ticketId) return;

    // Share the ticket with each selected user
    await Promise.all(
      selectedUsers.map((userId) => shareTicket(ticketId, userId))
    );

    // Filter out the selected users from the dropdown
    setAllUsers((prev) =>
      prev.filter((user) => !selectedUsers.includes(user.value))
    );

    onClose();
    updateTicketDetails();
    setSelectedUsers([]);
  };

  const fetchUsers = async () => {
    const users = await getAllUsers(ticketId);

    if ("error" in users) {
      console.error(users.message);
      return;
    }

    setAllUsers(users);
  };

  useEffect(() => {
    fetchUsers();
  }, [isOpen]);

  return (
    <Modal
      opened={isOpen}
      onClose={onClose}
      title={
        <Group>
          <ThemeIcon variant="light" size="lg" radius="md">
            <IconUserPlus size={20} />
          </ThemeIcon>
          <Text fw={500}>Share Ticket</Text>
        </Group>
      }
      centered
      size="md"
      radius="lg"
    >
      <Stack gap="xl">
        <MultiSelect
          data={allUsers}
          value={selectedUsers}
          onChange={setSelectedUsers}
          placeholder="Search and select users..."
          label="Select Users"
          searchable
          clearable
          radius="md"
        />
        <Group justify="flex-end">
          <Button variant="light" color="gray" onClick={onClose} radius="md">
            Cancel
          </Button>
          <Button onClick={handleShareTicket} radius="md">
            Share Ticket
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};
export default ShareTicketModal;
