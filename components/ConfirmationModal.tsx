"use client";

import { Button, Group, Modal, Stack, Text } from "@mantine/core";
import { Dispatch, SetStateAction, useTransition } from "react";

type ConfirmationModalProps = {
  isOpen: boolean;
  onClose: () => void | Dispatch<SetStateAction<boolean>>;
  onConfirm: () => void;
  title?: string;
  description?: string;
  cancelText?: string;
  cancelColor?: string;
  confirmText?: string;
  confirmColor?: string;
  variant?: "default" | "danger" | "warning" | "success";
  withComment?: boolean;
  commentState?: string;
  setCommentState?: Dispatch<SetStateAction<string>>;
};

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  description,
  cancelText = "Cancel",
  cancelColor = "gray",
  confirmText = "Confirm",
  confirmColor = "blue",
  variant = "default",
}: ConfirmationModalProps) => {
  const [isPending, startTransition] = useTransition();

  const getVariantColors = () => {
    switch (variant) {
      case "danger":
        return { confirmColor: "red", title: "Are you sure?" };
      case "warning":
        return { confirmColor: "yellow", title: "Please confirm" };
      case "success":
        return { confirmColor: "green", title: "Success" };
      default:
        return { confirmColor, title };
    }
  };

  const { confirmColor: buttonColor } = getVariantColors();

  const handleConfirm = () => {
    startTransition(() => {
      onConfirm();
      onClose();
    });
  };

  return (
    <Modal
      opened={isOpen}
      onClose={onClose}
      withCloseButton={false}
      title={
        <Stack gap={0}>
          <Text size="md" fw={500}>
            {title}
          </Text>
          {description && (
            <Text size="sm" c="dimmed">
              {description}
            </Text>
          )}
        </Stack>
      }
      centered
      overlayProps={{
        backgroundOpacity: 0.55,
        blur: 3,
      }}
      size="sm"
    >
      <Stack gap="md" py={0}>
        <Group justify="flex-end" gap="sm">
          <Button
            variant="subtle"
            color={cancelColor}
            onClick={onClose}
            disabled={isPending}
          >
            {cancelText}
          </Button>
          <Button
            loading={isPending}
            color={buttonColor}
            onClick={handleConfirm}
          >
            {confirmText}
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};

export default ConfirmationModal;
