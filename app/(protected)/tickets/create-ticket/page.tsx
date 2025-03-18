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
import { DateInput } from "@mantine/dates";
import { notifications } from "@mantine/notifications";
import {
  IconArrowLeft,
  IconCheck,
  IconTrash,
  IconUsers,
  IconX,
} from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import {
  RichTextEditor,
  RichTextEditorRef,
} from "@/components/ui/RichTextEditor";

import { getReviewers } from "@/actions/get";
import { createTicket } from "@/actions/post";
import { useUserStore } from "@/stores/userStore";
import { ReviewerType } from "@/utils/types";
import { TicketFormSchema } from "@/utils/zod/schema";

const CreateTicketPage = () => {
  const router = useRouter();

  const { user } = useUserStore();

  const noteEditorRef = useRef<RichTextEditorRef>(null);
  const specificationsEditorRef = useRef<RichTextEditorRef>(null);

  const [isPending, startTransition] = useTransition();
  const [noteValue, setNoteValue] = useState<string>("");
  const [specificationsValue, setSpecificationsValue] = useState<string>("");
  const [reviewerOptions, setReviewerOptions] = useState<ReviewerType[]>([]);
  const [selectedReviewers, setSelectedReviewers] = useState<ReviewerType[]>(
    [],
  );

  const form = useForm<z.infer<typeof TicketFormSchema>>({
    resolver: zodResolver(TicketFormSchema),
    defaultValues: {
      ticketItemName: "",
      ticketItemDescription: "",
      ticketQuantity: 1,
      ticketSpecification: "",
      ticketNotes: "",
      ticketRfDateReceived: new Date(),
      ticketReviewer: [],
    },
  });

  const getFilteredOptions = () => {
    const filteredReviewers = reviewerOptions.filter(
      (option) =>
        !selectedReviewers.some(
          (reviewer) => reviewer.user_id === option.user_id,
        ),
    );

    return filteredReviewers.map((reviewer) => ({
      value: reviewer.user_id,
      label: reviewer.user_full_name,
    }));
  };

  const addReviewer = (value: string | null) => {
    if (!value) return;

    const selectedOption = reviewerOptions.find(
      (option) => option.user_id === value,
    );
    if (
      selectedOption &&
      !selectedReviewers.some((reviewer) => reviewer.user_id === value)
    ) {
      const newReviewer: ReviewerType = {
        user_id: selectedOption.user_id,
        user_full_name: selectedOption.user_full_name,
        user_email: selectedOption.user_email,
      };

      setSelectedReviewers([...selectedReviewers, newReviewer]);
      form.setValue("ticketReviewer", [
        ...selectedReviewers.map((r) => r.user_id),
        value,
      ]);

      form.clearErrors("ticketReviewer");
    }
  };

  const removeReviewer = (id: string) => {
    const updatedReviewers = selectedReviewers.filter(
      (reviewer) => reviewer.user_id !== id,
    );
    setSelectedReviewers(updatedReviewers);
    form.setValue(
      "ticketReviewer",
      updatedReviewers.map((r) => r.user_id),
    );
  };

  const onSubmit = async (values: z.infer<typeof TicketFormSchema>) => {
    if (!user || !user.user_id) return;

    values.ticketNotes = noteValue;

    const validatedFields = TicketFormSchema.safeParse(values);

    if (validatedFields.success) {
      startTransition(async () => {
        const res = await createTicket(validatedFields.data, user.user_id);

        if (res.success) {
          notifications.show({
            variant: "success",
            title: "Success",
            message: "Your ticket has been created successfully.",
            color: "green",
            icon: <IconCheck size={16} />,
          });
          form.clearErrors();
          form.reset();
          setSelectedReviewers([]);
          setNoteValue("");

          // Reset rich text editor
          noteEditorRef.current?.reset();

          // Redirect to ticket details page
          router.push(`/tickets/${res.ticket_id}`);
        } else {
          notifications.show({
            variant: "error",
            title: "Error ",
            message: "Failed to create ticket.",
            color: "red",
            icon: <IconX size={16} />,
          });
        }
      });
    }
  };

  useEffect(() => {
    const fetchReviewers = async () => {
      const res = await getReviewers();
      if (res) {
        setReviewerOptions(res as ReviewerType[]);
      }
    };

    fetchReviewers();
  }, []);

  if (!user) {
    return null;
  }

  return (
    <Container size={800} my={40}>
      <Card padding="lg">
        <Box mb="xl">
          <Button
            variant="light"
            onClick={() => router.push("/tickets")}
            leftSection={<IconArrowLeft size={16} />}
          >
            Go back
          </Button>
        </Box>
        <Stack gap="md">
          <Box>
            <Title fw={600} order={3} mb={4}>
              Create New Ticket
            </Title>
            <Text c="dimmed" size="sm">
              Fill out the form below to create a new ticket. All fields marked
              with <span style={{ color: "red" }}>*</span> are required.
            </Text>
          </Box>

          <Divider />

          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Stack gap="lg">
              <Box>
                <DateInput
                  {...form.register("ticketRfDateReceived")}
                  value={form.watch("ticketRfDateReceived")}
                  onChange={(date) =>
                    form.setValue("ticketRfDateReceived", date || new Date())
                  }
                  error={
                    form.formState.errors.ticketRfDateReceived
                      ?.message as string
                  }
                  label="RF Date Received"
                  placeholder="Select RF date"
                  disabled={isPending}
                  required
                  radius="md"
                />
              </Box>
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
                <Text size="sm" fw={500} mb={5}>
                  Specifications
                </Text>
                <RichTextEditor
                  ref={specificationsEditorRef}
                  value={specificationsValue}
                  onChange={(value) => {
                    setSpecificationsValue(value);
                    form.setValue("ticketSpecification", value);
                  }}
                />
              </Box>

              <Box>
                <Text size="sm" fw={500} mb={5}>
                  Notes
                </Text>
                <RichTextEditor
                  ref={noteEditorRef}
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
                            key={reviewer.user_id}
                            p="xs"
                            withBorder
                            radius="md"
                          >
                            <Grid align="center">
                              <Grid.Col span={1}>
                                <Avatar radius="xl" color="blue" size="md">
                                  {reviewer.user_full_name
                                    .substring(0, 2)
                                    .toUpperCase()}
                                </Avatar>
                              </Grid.Col>
                              <Grid.Col span={8}>
                                <Box>
                                  <Group gap="xs">
                                    <Text fw={500} size="sm">
                                      {reviewer.user_full_name}
                                    </Text>
                                  </Group>
                                  <Text size="xs" c="dimmed">
                                    {reviewer.user_email}
                                  </Text>
                                </Box>
                              </Grid.Col>
                              <Grid.Col span={3} style={{ textAlign: "right" }}>
                                <ActionIcon
                                  color="red"
                                  variant="subtle"
                                  onClick={() =>
                                    removeReviewer(reviewer.user_id)
                                  }
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
                  onClick={() => router.push("/tickets")}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isPending}
                  loading={isPending}
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
