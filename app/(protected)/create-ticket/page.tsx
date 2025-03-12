"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  ActionIcon,
  Avatar,
  Box,
  Button,
  Card,
  Container,
  Divider,
  Grid,
  Group,
  Paper,
  Select,
  Stack,
  Text,
  Textarea,
  TextInput,
  Title,
} from "@mantine/core";
import { IconSend, IconTrash, IconUsers } from "@tabler/icons-react";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { RichTextEditor } from "@/components/ui/RichTextEditor";

import { getReviewers } from "@/actions/get";
import { TicketFormSchema } from "@/utils/zod/schema";

const CreateTicketPage = () => {
  const [isPending, startTransition] = useTransition();
  const [noteValue, setNoteValue] = useState<string>("");
  const [selectedReviewers, setSelectedReviewers] = useState<
    Array<{
      id: string;
      name: string;
      email: string;
      role: string;
    }>
  >([]);

  const form = useForm<z.infer<typeof TicketFormSchema>>({
    resolver: zodResolver(TicketFormSchema),
    defaultValues: {
      ticketItemName: "",
      ticketItemDescription: "",
      ticketQuantity: 1,
      ticketSpecification: "",
      ticketNotes: "",
      ticketReviewer: [],
    },
  });

  // Extended reviewer options with email and fixed role
  const reviewerOptions = [
    {
      value: "12314",
      label: "John Doe",
      email: "john.doe@company.com",
      role: "Supervisor",
    },
    {
      value: "123987",
      label: "Jane Doe",
      email: "jane.doe@company.com",
      role: "Manager",
    },
    {
      value: "123908123",
      label: "Juan Dela Cruz",
      email: "juan.delacruz@company.com",
      role: "Supervisor",
    },
    {
      value: "456789",
      label: "Maria Garcia",
      email: "maria.garcia@company.com",
      role: "Manager",
    },
    {
      value: "987654",
      label: "Robert Smith",
      email: "robert.smith@company.com",
      role: "Supervisor",
    },
  ];

  const getFilteredOptions = () => {
    return reviewerOptions.filter(
      (option) =>
        !selectedReviewers.some((reviewer) => reviewer.id === option.value)
    );
  };

  const addReviewer = (value: string | null) => {
    if (!value) return;

    const selectedOption = reviewerOptions.find(
      (option) => option.value === value
    );
    if (
      selectedOption &&
      !selectedReviewers.some((reviewer) => reviewer.id === value)
    ) {
      const newReviewer = {
        id: selectedOption.value,
        name: selectedOption.label,
        email: selectedOption.email,
        role: selectedOption.role,
      };

      setSelectedReviewers([...selectedReviewers, newReviewer]);
      form.setValue("ticketReviewer", [
        ...selectedReviewers.map((r) => r.id),
        value,
      ]);

      form.clearErrors("ticketReviewer");
    }
  };

  const removeReviewer = (id: string) => {
    const updatedReviewers = selectedReviewers.filter(
      (reviewer) => reviewer.id !== id
    );
    setSelectedReviewers(updatedReviewers);
    form.setValue(
      "ticketReviewer",
      updatedReviewers.map((r) => r.id)
    );
  };

  const onSubmit = (values: z.infer<typeof TicketFormSchema>) => {
    values.ticketNotes = noteValue;

    const validatedFields = TicketFormSchema.safeParse(values);

    if (validatedFields.success) {
      startTransition(() => {
        console.log("data:", validatedFields.data);
      });
    }
  };

  useEffect(() => {
    const fetchReviewers = async () => {
      const res = await getReviewers();

      if (res.error) {
        console.log(res.message);
        return;
      }

      console.log("reviwers", res.data);
    };

    fetchReviewers();
  }, []);

  return (
    <Container size={800} my={40}>
      <Card padding="lg" radius="md" withBorder>
        <Stack gap="md">
          <Box>
            <Title fw={600} order={3} mb={4}>
              Create New Ticket
            </Title>
            <Text c="dimmed" size="sm">
              Fill out the form below to create a new ticket. All fields marked
              with * are required.
            </Text>
          </Box>

          <Divider />

          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Stack gap="lg">
              <Box>
                <TextInput
                  {...form.register("ticketItemName")}
                  error={
                    form.formState.errors.ticketItemName?.message as string
                  }
                  label="Item Name"
                  name="ticketItemName"
                  placeholder="Enter item name"
                  disabled={isPending}
                  required
                  radius="md"
                />
              </Box>
              <Box>
                <Textarea
                  {...form.register("ticketItemDescription")}
                  error={
                    form.formState.errors.ticketItemDescription
                      ?.message as string
                  }
                  label="Item Description"
                  name="ticketItemDescription"
                  placeholder="Enter item description"
                  disabled={isPending}
                  required
                  radius="md"
                />
              </Box>

              <Box>
                <TextInput
                  {...form.register("ticketQuantity", {
                    valueAsNumber: true,
                  })}
                  error={
                    form.formState.errors.ticketQuantity?.message as string
                  }
                  label="Quantity"
                  name="ticketQuantity"
                  placeholder="Enter quantity"
                  type="number"
                  required
                  disabled={isPending}
                  radius="md"
                />
              </Box>
              <Box>
                <TextInput
                  {...form.register("ticketSpecification")}
                  error={
                    form.formState.errors.ticketSpecification?.message as string
                  }
                  label="Specifications"
                  name="ticketSpecification"
                  placeholder="Enter specifications"
                  disabled={isPending}
                  radius="md"
                />
              </Box>

              <Box>
                <Text size="sm" fw={500} mb={5}>
                  Notes
                </Text>
                <RichTextEditor
                  value={noteValue}
                  onChange={(value) => {
                    setNoteValue(value);
                    form.setValue("ticketNotes", value);
                  }}
                />
              </Box>

              <Box>
                <Group p="apart" mb={5}>
                  <Text size="sm" fw={500}>
                    Reviewer*
                  </Text>
                  <Text size="xs" c="dimmed">
                    {selectedReviewers.length} reviewer(s) selected
                  </Text>
                </Group>

                <Select
                  key={selectedReviewers.length}
                  placeholder="Select reviewer"
                  data={getFilteredOptions()}
                  onChange={addReviewer}
                  disabled={isPending}
                  clearable
                  searchable
                  leftSection={<IconUsers size={16} />}
                  radius="md"
                  nothingFoundMessage="No more reviewers available"
                />

                {selectedReviewers.length > 0 && (
                  <Paper p="md" mt="sm" radius="md" withBorder>
                    <Stack gap="sm">
                      {selectedReviewers.map((reviewer, index) => (
                        <div key={index}>
                          <Paper
                            key={reviewer.id}
                            p="xs"
                            withBorder
                            radius="md"
                          >
                            <Grid align="center">
                              <Grid.Col span={1}>
                                <Avatar radius="xl" color="blue" size="md">
                                  {reviewer.name.substring(0, 2).toUpperCase()}
                                </Avatar>
                              </Grid.Col>
                              <Grid.Col span={8}>
                                <Box>
                                  <Group gap="xs">
                                    <Text fw={500} size="sm">
                                      {reviewer.name}
                                    </Text>
                                  </Group>
                                  <Text size="xs" c="dimmed">
                                    {reviewer.email}
                                  </Text>
                                </Box>
                              </Grid.Col>
                              <Grid.Col span={3} style={{ textAlign: "right" }}>
                                <ActionIcon
                                  color="red"
                                  variant="subtle"
                                  onClick={() => removeReviewer(reviewer.id)}
                                >
                                  <IconTrash size={16} />
                                </ActionIcon>
                              </Grid.Col>
                            </Grid>
                          </Paper>
                        </div>
                      ))}
                    </Stack>
                  </Paper>
                )}

                {form.formState.errors.ticketReviewer?.message && (
                  <Text size="xs" color="red" mt={5}>
                    {form.formState.errors.ticketReviewer.message as string}
                  </Text>
                )}
              </Box>

              <Divider my="sm" />

              <Group p="right" gap="md" justify="flex-end">
                <Button
                  variant="light"
                  type="button"
                  disabled={isPending}
                  color="gray"
                  radius="md"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isPending}
                  loading={isPending}
                  leftSection={<IconSend size={16} />}
                  radius="md"
                >
                  Submit Ticket
                </Button>
              </Group>
            </Stack>
          </form>
        </Stack>
      </Card>
    </Container>
  );
};

export default CreateTicketPage;
