"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  Container,
  Flex,
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
import { DateInput } from "@mantine/dates";
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
      RfDateReceived: new Date(),
      leadTimeDay: 1,
      quotationPrice: 0,
      quotationTerms: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    const validatedFields = CanvassFormSchema.safeParse(values);

    if (validatedFields.success) {
      startTransition(async () => {
        const res = await createCanvass({
          RfDateReceived: values.RfDateReceived,
          recommendedSupplier: values.recommendedSupplier,
          leadTimeDay: values.leadTimeDay,
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
    <Container w="100%" p={0}>
      <Stack>
        <Box>
          <Title fw={600} order={3} mb={4} ta={"center"} size="h2">
            Canvass Form
          </Title>
        </Box>

        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Stack gap="lg">
            <Box>
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
              />
            </Box>
            <Box>
              <TextInput
                {...form.register("recommendedSupplier")}
                error={form.formState.errors.recommendedSupplier?.message}
                label="Recommended Supplier"
                name="recommendedSupplier"
                placeholder="Enter recommended supplier"
                disabled={isPending}
                required
                radius="md"
              />
            </Box>
            <Box>
              <TextInput
                {...form.register("leadTimeDay", {
                  valueAsNumber: true,
                })}
                error={form.formState.errors.leadTimeDay?.message}
                label="Lead Time Day"
                name="leadTimeDay"
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
            <Flex justify="end">
              <Button type="submit" loading={isPending} w="fit-content" my="md">
                Create canvass
              </Button>
            </Flex>
          </Stack>
        </form>
      </Stack>
    </Container>
  );
};

export default CanvassForm;
