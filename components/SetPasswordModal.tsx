import { setUserPassword } from "@/actions/update";
import { SetPasswordSchema } from "@/utils/zod/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Group,
  Modal,
  PasswordInput,
  Stack,
  Text,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface SetPasswordModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (value: boolean) => void;
}

const SetPasswordModal = ({
  isModalOpen,
  setIsModalOpen,
}: SetPasswordModalProps) => {
  const form = useForm<z.infer<typeof SetPasswordSchema>>({
    resolver: zodResolver(SetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const [isPending, startTransition] = useTransition();

  const handleSetPassword = (values: z.infer<typeof SetPasswordSchema>) => {
    const validatedFields = SetPasswordSchema.safeParse(values);

    if (validatedFields.success) {
      startTransition(async () => {
        const result = await setUserPassword(validatedFields.data.password);

        if (result?.error && result.message) {
          notifications.show({
            title: "Error",
            message: "Something went wrong",
            color: "red",
            icon: <IconX size={16} />,
          });
          return;
        }

        notifications.show({
          title: "Success",
          message: "Password changed successfully",
          color: "green",
          icon: <IconCheck size={16} />,
        });
        setIsModalOpen(false);
      });
    }
  };

  return (
    <Modal
      opened={isModalOpen}
      onClose={() => {
        setIsModalOpen(false);
        form.reset();
        form.clearErrors();
      }}
      title={
        <Text fz="h3" fw={700} px="sm" pt="sm">
          Set your password
        </Text>
      }
      centered
      w={400}
      withCloseButton={false}
    >
      <form onSubmit={form.handleSubmit(handleSetPassword)}>
        <Stack gap="md" p="sm" pt="0">
          <PasswordInput
            {...form.register("password")}
            error={form.formState.errors.password?.message}
            label="New Password"
            placeholder="Enter new password"
            disabled={isPending}
            radius="md"
            withAsterisk
          />

          <PasswordInput
            {...form.register("confirmPassword")}
            error={form.formState.errors.confirmPassword?.message}
            label="Confirm Password"
            placeholder="Confirm your new password"
            disabled={isPending}
            radius="md"
            withAsterisk
          />

          <Group justify="flex-end" mt="md">
            <Button
              variant="light"
              onClick={() => {
                setIsModalOpen(false);
                form.reset();
              }}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" loading={isPending} variant="filled">
              Set password
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
};
export default SetPasswordModal;
