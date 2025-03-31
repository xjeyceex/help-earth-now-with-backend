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
import { useEffect, useState, useTransition } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

import { startCanvass } from "@/actions/post";
import { updateCanvass } from "@/actions/update";
import { useUserStore } from "@/stores/userStore";
import { CanvassDetail, TicketDetailsType } from "@/utils/types";
import { CanvassFormSchema } from "@/utils/zod/schema";
import { DateInput } from "@mantine/dates";
import { notifications } from "@mantine/notifications";
import {
  IconCheck,
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

type EditCanvassFormProps = {
  ticketId: string;
  setTicket: React.Dispatch<React.SetStateAction<TicketDetailsType | null>>;
  updateCanvassDetails: () => void;
  updateTicketDetails: () => void;
  currentCanvassDetails: CanvassDetail[];
};

type CanvassFormValues = z.infer<typeof CanvassFormSchema>;

type AttachmentData = {
  canvass_attachment_id: string;
  canvass_attachment_url: string;
  canvass_attachment_type: string;
  canvass_attachment_file_type: string;
  canvass_attachment_file_size: number;
  canvass_attachment_created_at: string;
};

const EditCanvassForm = ({
  ticketId,
  updateCanvassDetails,
  currentCanvassDetails,
  updateTicketDetails,
}: EditCanvassFormProps) => {
  const { user } = useUserStore();

  const [isPending, startTransition] = useTransition();
  const [isLoadingFiles, setIsLoadingFiles] = useState(false);

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

  // Set up the field array for quotations
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "quotations",
  });

  const handleCanvassAction = async (status: string) => {
    if (!user || !ticketId) return;

    try {
      await startCanvass(ticketId, user.user_id, status); // Pass the status argument
    } catch (error) {
      console.error("Error starting canvass:", error);
    }
  };

  const onSubmit = async (values: CanvassFormValues) => {
    const validatedFields = CanvassFormSchema.safeParse(values);

    if (validatedFields.success) {
      startTransition(async () => {
        // Filter out only the files that have changed (are not undefined)
        const validQuotations = values.quotations.map((q) =>
          q.file instanceof File ? q.file : null
        );

        const result = await updateCanvass({
          RfDateReceived: values.RfDateReceived,
          recommendedSupplier: values.recommendedSupplier,
          leadTimeDay: values.leadTimeDay,
          totalAmount: values.totalAmount,
          paymentTerms: values.paymentTerms,
          canvassSheet:
            values.canvassSheet instanceof File ? values.canvassSheet : null,
          quotations: validQuotations,
          ticketId,
          currentCanvassFormId: currentCanvassDetails[0].canvass_form_id,
        });

        if (result.error) {
          notifications.show({
            title: "Error",
            message: result.error,
            color: "red",
            icon: <IconX size={16} />,
          });
        } else {
          notifications.show({
            title: "Success",
            message: "Canvass form updated successfully",
            color: "green",
            icon: <IconCheck size={16} />,
          });

          if (user?.user_role === "REVIEWER") {
            await handleCanvassAction("FOR APPROVAL");
            updateCanvassDetails();
            updateTicketDetails();
            return;
          }

          if (user?.user_role === "PURCHASER") {
            await handleCanvassAction("FOR REVIEW OF SUBMISSIONS");
            updateCanvassDetails();
            updateTicketDetails();
            return;
          }
        }
      });
    }
  };

  const addQuotation = () => {
    if (fields.length < 4) {
      append({ file: undefined });
    }
  };

  // Convert a remote URL to a File object
  const urlToFile = async (
    attachment: AttachmentData
  ): Promise<File | null> => {
    try {
      // Fetch the file
      const response = await fetch(attachment.canvass_attachment_url);
      if (!response.ok) throw new Error("Failed to fetch file");

      const blob = await response.blob();

      // Extract filename from URL
      const url = new URL(attachment.canvass_attachment_url);
      const pathSegments = url.pathname.split("/");
      const fileName = pathSegments[pathSegments.length - 1] || "file";

      // Create a File object from the blob
      const file = new File([blob], fileName, {
        type: attachment.canvass_attachment_file_type,
      });

      return file;
    } catch (error) {
      console.error("Error converting URL to File:", error);
      notifications.show({
        variant: "error",
        title: "Error",
        message: "Failed to load existing file",
        color: "red",
        icon: <IconX size={16} />,
      });
      return null;
    }
  };

  useEffect(() => {
    if (!currentCanvassDetails.length) return;

    // Set loading state to true when form becomes visible
    setIsLoadingFiles(true);

    // Set basic form values
    form.setValue(
      "RfDateReceived",
      new Date(currentCanvassDetails[0].canvass_form_rf_date_received)
    );
    form.setValue(
      "recommendedSupplier",
      currentCanvassDetails[0].canvass_form_recommended_supplier
    );
    form.setValue(
      "leadTimeDay",
      currentCanvassDetails[0].canvass_form_lead_time_day
    );
    form.setValue(
      "totalAmount",
      currentCanvassDetails[0].canvass_form_total_amount
    );
    form.setValue(
      "paymentTerms",
      currentCanvassDetails[0].canvass_form_payment_terms!
    );

    // Ensure we have attachments to process
    if (
      currentCanvassDetails[0]?.attachments &&
      Array.isArray(currentCanvassDetails[0].attachments) &&
      currentCanvassDetails[0].attachments.length > 0
    ) {
      const loadAttachments = async () => {
        try {
          const attachments = currentCanvassDetails[0]
            .attachments as AttachmentData[];

          // Find and load the canvass sheet
          const canvassSheet = attachments.find(
            (a) => a.canvass_attachment_type === "CANVASS_SHEET"
          );

          if (canvassSheet) {
            const canvassSheetFile = await urlToFile(canvassSheet);
            if (canvassSheetFile) {
              form.setValue("canvassSheet", canvassSheetFile);
            }
          }

          // Handle quotations
          const quotations = attachments
            .filter((a) => a.canvass_attachment_type.startsWith("QUOTATION_"))
            .sort((a, b) => {
              // Extract the number from QUOTATION_1, QUOTATION_2, etc.
              const aNum = parseInt(a.canvass_attachment_type.split("_")[1]);
              const bNum = parseInt(b.canvass_attachment_type.split("_")[1]);
              return aNum - bNum;
            });

          // Reset quotations array in form
          if (quotations.length === 0) {
            form.setValue("quotations", [{ file: undefined }]);
          } else {
            // Load each quotation
            const quotationFiles = await Promise.all(
              quotations.map(async (q) => {
                const file = await urlToFile(q);
                return { file: file || undefined }; // Convert null to undefined
              })
            );

            // Filter out nulls
            const validQuotationFiles = quotationFiles.filter(
              (q) => q.file !== null
            );

            // Ensure we have at least one entry
            if (validQuotationFiles.length === 0) {
              form.setValue("quotations", [{ file: undefined }]);
            } else {
              form.setValue("quotations", quotationFiles);
            }
          }
        } catch (error) {
          console.error("Error loading attachments:", error);
          notifications.show({
            variant: "error",
            title: "Error",
            message: "Failed to load existing attachments",
            color: "red",
            icon: <IconX size={16} />,
          });
        } finally {
          // Set loading state to false when done
          setIsLoadingFiles(false);
        }
      };

      loadAttachments();
    } else {
      // If no attachments, still set loading to false
      setIsLoadingFiles(false);
    }
  }, [currentCanvassDetails, form]);

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
                disabled={isPending || isLoadingFiles}
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
                disabled={isPending || isLoadingFiles}
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
                disabled={isPending || isLoadingFiles}
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
                disabled={isPending || isLoadingFiles}
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
                disabled={isPending || isLoadingFiles}
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
                      isLoading={isLoadingFiles}
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
                        disabled={isPending || isLoadingFiles}
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
                          isLoading={isLoadingFiles}
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
                  disabled={isPending || isLoadingFiles || fields.length >= 4}
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
            <Button
              type="submit"
              loading={isPending}
              size="md"
              radius="md"
              disabled={isLoadingFiles}
            >
              Update Form
            </Button>
          </Group>
        </Stack>
      </form>
    </Container>
  );
};

export default EditCanvassForm;
