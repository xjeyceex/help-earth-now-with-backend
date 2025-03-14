"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  Container,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { createCanvass } from "@/actions/post";
import { CanvassFormSchema } from "@/utils/zod/schema";
import { notifications } from "@mantine/notifications";
import { IconX } from "@tabler/icons-react";
import DropzoneFileInput from "./ui/DropzoneFileInput";

type FormValues = z.infer<typeof CanvassFormSchema>;

interface CanvassFormProps {
  ticketId: string;
  updateCanvassDetails: () => void;
}

const CanvassForm = ({ ticketId, updateCanvassDetails }: CanvassFormProps) => {
  const [isPending, startTransition] = useTransition();

  const form = useForm<FormValues>({
    resolver: zodResolver(CanvassFormSchema),
    defaultValues: {
      supplierName: "",
      quotationPrice: 0,
      quotationTerms: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    const validatedFields = CanvassFormSchema.safeParse(values);

    if (validatedFields.success) {
      startTransition(async () => {
        const res = await createCanvass({
          supplierName: values.supplierName,
          quotationPrice: values.quotationPrice,
          quotationTerms: values.quotationTerms,
          canvassSheet: values.canvassSheet,
          quotation: values.quotation,
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
          console.log(res.error);
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

          // Update canvass details
          updateCanvassDetails();
        }
      });
    }
  };

  return (
    <Container w="100%" mt={40} p="0">
      {/* Canvass Form */}
      <Stack p="0">
        <Box>
          <Title fw={600} order={3} mb={4}>
            Canvass Form
          </Title>
        </Box>

        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Stack gap="lg">
            <Box>
              <TextInput
                {...form.register("supplierName")}
                error={form.formState.errors.supplierName?.message}
                label="Supplier Name"
                name="supplierName"
                placeholder="Enter supplier name"
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
                error={form.formState.errors.quotationPrice?.message}
                label="Quotation Price"
                name="quotationPrice"
                placeholder="Enter quotation price"
                type="number"
                required
                disabled={isPending}
                radius="md"
                step="any"
              />
            </Box>
            <Box>
              <TextInput
                {...form.register("quotationTerms")}
                error={form.formState.errors.quotationTerms?.message}
                label="Quotation Terms"
                name="quotationTerms"
                placeholder="Enter quotation terms"
                disabled={isPending}
                required
                radius="md"
              />
            </Box>
            <Box>
              <Text size="sm" fw={500} mb={5}>
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
            <Box>
              <Text size="sm" fw={500} mb={5}>
                Quotation 1{" "}
                <Text component="span" c="red">
                  *
                </Text>
              </Text>
              <Controller
                name="quotation"
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
            <Button type="submit" loading={isPending} fullWidth>
              Create canvass
            </Button>
          </Stack>
        </form>
      </Stack>
    </Container>
  );
};

export default CanvassForm;
