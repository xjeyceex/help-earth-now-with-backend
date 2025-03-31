"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  Container,
  Grid,
  Group,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { useTransition } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

import { createCanvass, startCanvass } from "@/actions/post";
import { useUserStore } from "@/stores/userStore";
import { TicketDetailsType } from "@/utils/types";
import { CanvassFormSchema } from "@/utils/zod/schema";
import { DateInput } from "@mantine/dates";
import { notifications } from "@mantine/notifications";
import {
  IconClipboard,
  IconClock,
  IconCreditCardPay,
  IconMoneybag,
  IconPlus,
  IconShoppingCart,
  IconTrash,
  IconX,
} from "@tabler/icons-react";
import DropzoneFileInput from "./ui/DropzoneFileInput";

type CanvassFormProps = {
  ticketId: string;
  setTicket: React.Dispatch<React.SetStateAction<TicketDetailsType | null>>;
  updateCanvassDetails: () => void;
};

type CanvassFormValues = z.infer<typeof CanvassFormSchema>;

const CanvassForm = ({
  ticketId,
  updateCanvassDetails,
  setTicket,
}: CanvassFormProps) => {
  const [isPending, startTransition] = useTransition();
  const { user } = useUserStore();

  const form = useForm<CanvassFormValues>({
    resolver: zodResolver(CanvassFormSchema),
    defaultValues: {
      RfDateReceived: new Date(),
      leadTimeDay: 1,
      totalAmount: 0,
      paymentTerms: "",
      quotations: [{ file: undefined }],
    },
  });

  const handleCanvassAction = async (status: string) => {
    if (!user || !ticketId) return;

    try {
      await startCanvass(ticketId, user.user_id, status); // Pass the status argument
    } catch (error) {
      console.error("Error starting canvass:", error);
    }
  };

  // Set up the field array for quotations
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "quotations",
  });

  const onSubmit = async (values: CanvassFormValues) => {
    const validatedFields = CanvassFormSchema.safeParse(values);

    if (validatedFields.success) {
      startTransition(async () => {
        const validQuotations = values.quotations
          .map((q) => q.file)
          .filter((file): file is File => file instanceof File);

        const res = await createCanvass({
          RfDateReceived: values.RfDateReceived,
          recommendedSupplier: values.recommendedSupplier,
          leadTimeDay: values.leadTimeDay,
          totalAmount: values.totalAmount,
          paymentTerms: values.paymentTerms,
          canvassSheet: values.canvassSheet,
          quotations: validQuotations,
          ticketId: ticketId,
        });

        if (res.error) {
          notifications.show({
            variant: "error",
            title: "Error",
            message: "Failed to create canvass.",
            color: "red",
            icon: <IconX size={16} />,
          });
        }

        if (res.success) {
          notifications.show({
            variant: "success",
            title: "Success",
            message: "Canvass created successfully.",
            color: "green",
            icon: <IconX size={16} />,
          });
          form.reset();

          handleCanvassAction("FOR REVIEW OF SUBMISSIONS");
          setTicket((prev) =>
            prev
              ? { ...prev, ticket_status: "FOR REVIEW OF SUBMISSIONS" }
              : null,
          );
          updateCanvassDetails();
        }
      });
    }
  };

  const addQuotation = () => {
    if (fields.length < 4) {
      append({ file: undefined });
    }
  };

  return (
    <Container size="md" px="0">
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Stack gap="xl">
          {/* Basic Information Section */}
          <Grid gutter="lg">
            <Grid.Col span={{ base: 12, sm: 6 }}>
              <DateInput
                {...form.register("RfDateReceived")}
                value={form.watch("RfDateReceived")}
                onChange={(date) =>
                  form.setValue("RfDateReceived", date || new Date())
                }
                error={form.formState.errors.RfDateReceived?.message as string}
                label="RF Date Received"
                placeholder="Select RF date"
                disabled={isPending}
                required
                radius="md"
                leftSection={
                  <IconClipboard
                    size={16}
                    style={{ color: "var(--mantine-color-blue-6)" }}
                  />
                }
                size="md"
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, sm: 6 }}>
              <TextInput
                {...form.register("recommendedSupplier")}
                error={form.formState.errors.recommendedSupplier?.message}
                label="Recommended Supplier"
                placeholder="Enter recommended supplier"
                disabled={isPending}
                required
                radius="md"
                size="md"
                leftSection={
                  <IconShoppingCart
                    size={16}
                    style={{ color: "var(--mantine-color-blue-6)" }}
                  />
                }
              />
            </Grid.Col>
          </Grid>

          <Grid gutter="lg">
            <Grid.Col span={{ base: 12, sm: 4 }}>
              <TextInput
                {...form.register("leadTimeDay", {
                  valueAsNumber: true,
                })}
                error={form.formState.errors.leadTimeDay?.message}
                label="Lead Time (days)"
                name="leadTimeDay"
                placeholder="Enter lead time"
                type="number"
                required
                disabled={isPending}
                radius="md"
                step="any"
                size="md"
                leftSection={
                  <IconClock
                    size={16}
                    style={{ color: "var(--mantine-color-blue-6)" }}
                  />
                }
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, sm: 4 }}>
              <TextInput
                {...form.register("totalAmount", {
                  valueAsNumber: true,
                })}
                error={form.formState.errors.totalAmount?.message}
                label="Total Amount"
                name="totalAmount"
                placeholder="Enter Total Amount"
                type="number"
                required
                disabled={isPending}
                radius="md"
                step="any"
                size="md"
                leftSection={
                  <IconMoneybag
                    size={16}
                    style={{ color: "var(--mantine-color-blue-6)" }}
                  />
                }
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, sm: 4 }}>
              <TextInput
                {...form.register("paymentTerms")}
                error={form.formState.errors.paymentTerms?.message}
                label="Payment Terms"
                placeholder="e.g., Net 30"
                disabled={isPending}
                required
                radius="md"
                size="md"
                leftSection={
                  <IconCreditCardPay
                    size={16}
                    style={{ color: "var(--mantine-color-blue-6)" }}
                  />
                }
                styles={{
                  input: {
                    "&:focus": {
                      borderColor: "var(--mantine-color-blue-6)",
                    },
                  },
                }}
              />
            </Grid.Col>
          </Grid>

          <Stack gap="lg">
            {/* Canvass Sheet Upload */}
            <Box>
              <Text size="md" fw={500} mb={5}>
                Canvass Sheet{" "}
                <Text component="span" c="red">
                  *
                </Text>
              </Text>
              <Controller
                name="canvassSheet"
                control={form.control}
                render={({ field, fieldState }) => (
                  <>
                    <DropzoneFileInput
                      onChange={(files) => field.onChange(files)}
                      value={field.value}
                    />
                    {fieldState.error && (
                      <Text c="red" size="sm" mt={5}>
                        {fieldState.error.message}
                      </Text>
                    )}
                  </>
                )}
              />
            </Box>

            {/* Quotations Section */}
            <Stack gap="md">
              {fields.map((field, index) => (
                <Box key={field.id}>
                  <Group justify="space-between" mb="xs">
                    <Text size="md" fw={500}>
                      Quotation {index + 1}
                      {index === 0 && (
                        <Text component="span" c="red">
                          {" "}
                          *
                        </Text>
                      )}
                    </Text>
                    {index > 0 && (
                      <Button
                        variant="subtle"
                        color="red"
                        size="xs"
                        onClick={() => remove(index)}
                        disabled={isPending}
                      >
                        <IconTrash size={16} />
                      </Button>
                    )}
                  </Group>
                  <Controller
                    name={`quotations.${index}.file`}
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <>
                        <DropzoneFileInput
                          onChange={(files) => field.onChange(files)}
                          value={field.value}
                        />
                        {fieldState.error && (
                          <Text c="red" size="sm" mt={5}>
                            {fieldState.error.message}
                          </Text>
                        )}
                      </>
                    )}
                  />
                </Box>
              ))}

              {fields.length < 4 && (
                <Button
                  variant="light"
                  onClick={addQuotation}
                  disabled={isPending || fields.length >= 4}
                  leftSection={<IconPlus size={16} />}
                  color="blue"
                  fullWidth
                  size="md"
                >
                  Add Quotation ({fields.length}/4)
                </Button>
              )}
            </Stack>
          </Stack>

          <Group justify="flex-end">
            <Button type="submit" loading={isPending} size="md" radius="md">
              Submit Form
            </Button>
          </Group>
        </Stack>
      </form>
    </Container>
  );
};

export default CanvassForm;
