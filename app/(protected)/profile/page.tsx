"use client";

import {
  changePassword,
  updateDisplayName,
  updateProfilePicture,
} from "@/actions/post";
import LoadingStateProtected from "@/components/LoadingStateProtected";
import { useUserStore } from "@/stores/userStore";
import {
  ActionIcon,
  Avatar,
  Box,
  Button,
  Divider,
  Group,
  Modal,
  Paper,
  rem,
  Stack,
  Text,
  TextInput,
  ThemeIcon,
  Title,
  Tooltip,
  useMantineColorScheme,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import {
  IconAlertCircle,
  IconCheck,
  IconEdit,
  IconLock,
  IconMail,
  IconUserShield,
} from "@tabler/icons-react";
import { useState } from "react";

const ProfilePage = () => {
  const { colorScheme } = useMantineColorScheme();
  const { user, setUser } = useUserStore();

  const [isEditingName, setIsEditingName] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [newName, setNewName] = useState(user?.user_full_name || "");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!user) {
    return <LoadingStateProtected />;
  }

  const handleAvatarUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    const result = await updateProfilePicture(file);
    setLoading(false);

    if (result?.error) {
      notifications.show({
        title: "Error",
        message: "Failed to update profile picture",
        color: "red",
        icon: <IconAlertCircle size={16} />,
      });
    } else {
      notifications.show({
        title: "Success",
        message: "Profile picture updated successfully",
        color: "green",
        icon: <IconCheck size={16} />,
      });
      setUser({ ...user, user_avatar: result.url ?? "" });
    }
  };

  const handleUpdateName = async () => {
    if (!newName.trim() || newName === user.user_full_name) return;

    setLoading(true);
    const result = await updateDisplayName(newName);
    setLoading(false);

    if (result?.error) {
      notifications.show({
        title: "Error",
        message: result.message,
        color: "red",
        icon: <IconAlertCircle size={16} />,
      });
    } else {
      notifications.show({
        title: "Success",
        message: "Name updated successfully",
        color: "green",
        icon: <IconCheck size={16} />,
      });
      setUser({ ...user, user_full_name: newName });
      setIsEditingName(false);
    }
  };

  const handleChangePassword = async () => {
    setError("");

    // Validation logic
    if (!oldPassword.trim()) {
      setError("Current password is required.");
      return;
    }
    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters.");
      return;
    }
    if (!/[A-Z]/.test(newPassword) || !/[0-9]/.test(newPassword)) {
      setError(
        "Password must contain at least one uppercase letter and one number.",
      );
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match.");
      return;
    }

    setLoading(true);
    const result = await changePassword(oldPassword, newPassword);
    setLoading(false);

    if (result?.error) {
      setError(result.message || "Failed to change password.");
    } else {
      notifications.show({
        title: "Success",
        message: "Password changed successfully",
        color: "green",
        icon: <IconCheck size={16} />,
      });
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setIsChangingPassword(false);
    }
  };

  return (
    <Box p={{ base: "md", sm: "xl" }}>
      <Stack gap={2} mb="xl">
        <Title order={2} fw={600}>
          Profile
        </Title>
        <Text c="dimmed" size="sm">
          TODO: Breadcrumbs
        </Text>
      </Stack>
      <Stack gap="xl">
        {/* Header Section */}
        <Paper
          shadow="xs"
          p="xl"
          radius="md"
          style={(theme) => ({
            backgroundColor:
              colorScheme === "dark" ? theme.colors.dark[6] : theme.white,
            border: `1px solid ${
              colorScheme === "dark"
                ? theme.colors.dark[4]
                : theme.colors.gray[2]
            }`,
          })}
        >
          <Group wrap="nowrap" gap="xl">
            <Box>
              <label htmlFor="avatar-upload" style={{ cursor: "pointer" }}>
                <Avatar
                  variant="light"
                  src={user.user_avatar}
                  size={120}
                  radius="md"
                  color="blue"
                  style={{
                    cursor: "pointer",
                    transition: "transform 0.2s ease",
                    "&:hover": {
                      transform: "scale(1.05)",
                    },
                  }}
                >
                  {user.user_full_name?.charAt(0).toUpperCase()}
                </Avatar>
              </label>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                style={{ display: "none" }}
              />
            </Box>

            <Stack gap={4}>
              <Group align="center" gap="xs">
                <Title order={2} fw={600}>
                  {user.user_full_name}
                </Title>
                <Tooltip label="Edit name">
                  <ActionIcon
                    variant="subtle"
                    onClick={() => setIsEditingName(true)}
                    size="sm"
                  >
                    <IconEdit style={{ width: rem(14), height: rem(14) }} />
                  </ActionIcon>
                </Tooltip>
              </Group>
              <Group gap="xs">
                <ThemeIcon size="sm" variant="light" radius="xl">
                  <IconMail style={{ width: rem(12), height: rem(12) }} />
                </ThemeIcon>
                <Text size="sm" c="dimmed">
                  {user.user_email}
                </Text>
              </Group>
              <Group gap="xs">
                <ThemeIcon size="sm" variant="light" radius="xl">
                  <IconUserShield style={{ width: rem(12), height: rem(12) }} />
                </ThemeIcon>
                <Text size="sm" c="dimmed" tt="capitalize">
                  {user.user_role.toLowerCase()}
                </Text>
              </Group>
            </Stack>
          </Group>
        </Paper>

        {/* Settings Section */}
        <Paper
          shadow="xs"
          radius="md"
          style={(theme) => ({
            backgroundColor:
              colorScheme === "dark" ? theme.colors.dark[6] : theme.white,
            border: `1px solid ${
              colorScheme === "dark"
                ? theme.colors.dark[4]
                : theme.colors.gray[2]
            }`,
          })}
        >
          <Stack gap={0}>
            <Text p="md" fw={500}>
              Account Settings
            </Text>
            <Divider />

            <Group
              p="md"
              justify="space-between"
              wrap="nowrap"
              style={(theme) => ({
                "&:hover": {
                  backgroundColor:
                    colorScheme === "dark"
                      ? theme.colors.dark[5]
                      : theme.colors.gray[0],
                },
              })}
            >
              <Stack gap={1}>
                <Text size="sm" fw={500}>
                  Change Password
                </Text>
                <Text size="xs" c="dimmed">
                  Update your password to keep your account secure
                </Text>
              </Stack>
              <Button
                variant="light"
                size="xs"
                leftSection={<IconLock size={14} />}
                onClick={() => setIsChangingPassword(true)}
              >
                Update
              </Button>
            </Group>
          </Stack>
        </Paper>
      </Stack>

      {/* Update Name Modal */}
      <Modal
        opened={isEditingName}
        onClose={() => setIsEditingName(false)}
        title="Update Name"
        centered
        size="sm"
      >
        <Stack>
          <TextInput
            label="New Name"
            placeholder="Enter new name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            disabled={loading}
          />
          <Button onClick={handleUpdateName} loading={loading} fullWidth>
            Save Changes
          </Button>
        </Stack>
      </Modal>

      {/* Change Password Modal */}
      <Modal
        opened={isChangingPassword}
        onClose={() => setIsChangingPassword(false)}
        title="Change Passwords"
        centered
        size="sm"
      >
        <Stack>
          <TextInput
            type="password"
            label="Current Password"
            placeholder="Enter current password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            disabled={loading}
          />
          <TextInput
            type="password"
            label="New Password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            disabled={loading}
          />
          <TextInput
            type="password"
            label="Confirm Password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={loading}
          />
          {error && (
            <Text size="sm" c="red">
              {error}
            </Text>
          )}
          <Button onClick={handleChangePassword} loading={loading} fullWidth>
            Update Password
          </Button>
        </Stack>
      </Modal>
    </Box>
  );
};

export default ProfilePage;
