"use client";

import TicketList from "@/app/components/TicketList";
import { Container, Title } from "@mantine/core";

const TicketListPage = () => {
  return (
    <>
      <Container size="md" py="xl">
        <Title ta="center">Ticket List</Title>
        <TicketList />
      </Container>
    </>
  );
};

export default TicketListPage;
