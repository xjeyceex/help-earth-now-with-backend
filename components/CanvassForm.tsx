"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Avatar,
  Box,
  Card,
  Container,
  Divider,
  Group,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { ReviewerType } from "@/app/(protected)/tickets/create-ticket/page";
import { CanvassFormSchema } from "@/utils/zod/schema";

type Ticket = {
  ticketId: string;
  ticketItemName: string;
  ticketItemDescription: string;
  ticketQuantity: number;
  ticketSpecification?: string;
  ticketNotes?: string;
  ticketReviewer: ReviewerType[];
};

interface CanvassFormProps {
  ticketData: Ticket;
}

const CanvassForm = ({ ticketData }: CanvassFormProps) => {
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof CanvassFormSchema>>({
    resolver: zodResolver(CanvassFormSchema),
    defaultValues: {
      supplierName: "",
      quotationPrice: 0,
      quotationTerms: "",
    },
  });

  return (
    <Container size={800} my={40}>
      <Card shadow="sm" radius="md" padding="lg" mb="xl">
        <Stack gap="lg">
          {/* Header */}
          <Box>
            <Title order={2} mb={5}>
              Ticket Details
            </Title>
            <Text c="dimmed" size="sm">
              Review the ticket information below
            </Text>
          </Box>

          <Divider />

          <Box>
            <Group gap="sm">
              <Avatar radius="xl" color="blue" size="md">
                OM
              </Avatar>
              <Box>
                <Text size="sm" fw={600}>
                  Omar Morales
                </Text>
                <Text size="xs" c="dimmed">
                  Raised this on Today 9:47 AM
                </Text>
              </Box>
            </Group>
          </Box>

          {/* Basic Information */}
          <Stack gap="md">
            <InfoItem label="Ticket ID" value={ticketData.ticketId} />
            <InfoItem label="Item Name" value={ticketData.ticketItemName} />
            <InfoItem
              label="Item Description"
              value={ticketData.ticketItemDescription}
            />
            <InfoItem
              label="Quantity"
              value={ticketData.ticketQuantity.toString()}
            />

            {ticketData.ticketSpecification && (
              <InfoItem
                label="Specification"
                value={ticketData.ticketSpecification}
              />
            )}

            {ticketData.ticketNotes && (
              <InfoItem label="Notes" value={ticketData.ticketNotes} />
            )}

            <InfoItem
              label="Reviewers"
              value={ticketData.ticketReviewer[0].user_full_name}
            />
          </Stack>
        </Stack>
      </Card>

      {/* Canvass Form */}
      <Card shadow="sm" radius="md" padding="lg" mb="xl">
        <Stack gap="md">
          <Box>
            <Title fw={600} order={3} mb={4}>
              Canvass Form
            </Title>
          </Box>

          <Divider />

          <form>
            <Stack gap="lg">
              <Box>
                <TextInput
                  {...form.register("supplierName")}
                  error={form.formState.errors.supplierName?.message as string}
                  label="Supplier Name"
                  name="supplierName"
                  placeholder="Enter item name"
                  disabled={isPending}
                  required
                  radius="md"
                />
              </Box>
              <Box>
                <TextInput
                  {...form.register("quotationPrice", {
                    valueAsNumber: true,
                  })}
                  error={
                    form.formState.errors.quotationPrice?.message as string
                  }
                  label="Quotation Price"
                  name="quotationPrice"
                  placeholder="Enter quotation price"
                  type="number"
                  required
                  disabled={isPending}
                  radius="md"
                />
              </Box>
              <Box>
                <TextInput
                  {...form.register("quotationTerms")}
                  error={
                    form.formState.errors.quotationTerms?.message as string
                  }
                  label="Quotation Terms"
                  name="quotationTerms"
                  placeholder="Enter quotation terms"
                  disabled={isPending}
                  required
                  radius="md"
                />
              </Box>
            </Stack>
          </form>
        </Stack>
      </Card>
    </Container>
  );
};

const InfoItem = ({ label, value }: { label: string; value: string }) => (
  <Box>
    <Text fw={600} size="md" mb={4}>
      {label}
    </Text>
    <Text size="md" c="dimmed">
      {value}
    </Text>
  </Box>
);

export default CanvassForm;
