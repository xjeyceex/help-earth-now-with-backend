"use client";

import Navbar from "@/app/components/Navbar";
import { dummyTickets } from "@/dummyTickets";
import { useUserStore } from "@/stores/userStore";
import {
  Badge,
  Button,
  Card,
  Container,
  Flex,
  Select,
  Table,
  Text,
  Title,
} from "@mantine/core";
import Link from "next/link";
import { useState } from "react";

const DashboardPage = () => {
  const { user } = useUserStore();
  const [filter, setFilter] = useState("ALL");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "yellow";
      case "APPROVED":
        return "green";
      case "IN PROGRESS":
        return "blue";
      case "COMPLETED":
        return "teal";
      case "REJECTED":
        return "red";
      case "ON HOLD":
        return "orange";
      default:
        return "gray";
    }
  };

  // Restrict access if user is a purchaser
  if (user?.user_role === "purchaser") {
    return (
      <>
        <Navbar />
        <Container size="md" py="xl">
          <Title ta="center">Welcome to the Dashboard</Title>
          <Card shadow="sm" padding="lg" mt="lg" radius="md" withBorder>
            <Text ta="center" size="lg" c="dimmed">
              You do not have permission to access tickets.
            </Text>
          </Card>
        </Container>
      </>
    );
  }

  // Filter logic for tickets
  const filteredTickets = dummyTickets.filter((ticket) => {
    if (filter === "MINE" && ticket.assigned_to !== user?.user_full_name) {
      return false;
    }
    if (filter === "PENDING" && ticket.status !== "PENDING") {
      return false;
    }
    if (filter === "APPROVED" && ticket.status !== "APPROVED") {
      return false;
    }
    return true;
  });

  return (
    <>
      <Navbar />
      <Container size="md" py="xl">
        <Title ta="center">Welcome to the Dashboard</Title>

        {/* Ticket List */}
        <Card shadow="sm" padding="lg" mt="lg" radius="md" withBorder>
          <Flex justify="space-between" align="center">
            <Title size="h3">Ticket List</Title>
            <Flex gap="sm">
              <Select
                value={filter}
                onChange={(value) => setFilter(value || "ALL")}
                data={[
                  { value: "ALL", label: "All Tickets" },
                  { value: "MINE", label: "Assigned to Me" },
                  { value: "PENDING", label: "Pending Tickets" },
                  { value: "APPROVED", label: "Approved Tickets" },
                ]}
                placeholder="Filter tickets"
              />
              <Button onClick={() => setFilter("ALL")}>Reset</Button>
            </Flex>
          </Flex>

          <Table mt="md" striped highlightOnHover>
            <thead>
              <tr>
                <th style={{ textAlign: "left" }}>Ticket ID</th>
                <th style={{ textAlign: "left" }}>Title</th>
                <th style={{ textAlign: "left" }}>Assigned To</th>
                <th style={{ textAlign: "left" }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredTickets.map((ticket) => (
                <tr key={ticket.ticket_id}>
                  <td>
                    <Link
                      href={`/tickets/${ticket.ticket_id}`}
                      style={{ textDecoration: "none", color: "blue" }}
                    >
                      {ticket.ticket_id}
                    </Link>
                  </td>
                  <td>{ticket.title}</td>
                  <td>{ticket.assigned_to}</td>
                  <td>
                    <Badge color={getStatusColor(ticket.status)}>
                      {ticket.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card>
      </Container>
    </>
  );
};

export default DashboardPage;
