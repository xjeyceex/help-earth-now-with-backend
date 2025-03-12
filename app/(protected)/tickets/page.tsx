"use client";

import TicketList from "@/components/TicketList";
import { useUserStore } from "@/stores/userStore";
import { Button, Container, Stack, Title } from "@mantine/core";
import { useRouter } from "next/navigation";

const TicketListPage = () => {
  const { user } = useUserStore();
  const router = useRouter();

  return (
    <Container size="md" py="xl">
      <Stack align="center">
        <Title ta="center">Ticket List</Title>

        {/* Show button only if user role is 'canvasser' */}
        {user?.user_role === "CANVASSER" && (
          <Button onClick={() => router.push("/tickets/create-ticket")}>
            Create Ticket
          </Button>
        )}

        <TicketList />
      </Stack>
    </Container>
  );
};

export default TicketListPage;
