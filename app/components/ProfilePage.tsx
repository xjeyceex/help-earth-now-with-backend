"use client";

import { changePassword, updateDisplayName } from "@/actions/post";
import { useUserStore } from "@/stores/userStore";
import {
  Avatar,
  Button,
  Card,
  Container,
  Group,
  LoadingOverlay,
  Modal,
  Paper,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { IconArrowLeft, IconLock, IconUser } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const ProfilePage = () => {
  const { user, setUser } = useUserStore();
  const router = useRouter();

  // Modal state
  const [isEditingName, setIsEditingName] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Input state
  const [newName, setNewName] = useState(user?.user_full_name || "");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!user) {
    return (
      <Container size="sm" py="xl">
        <Text ta="center" size="lg" c="dimmed">
          Loading user data...
        </Text>
      </Container>
    );
  }

  const handleUpdateName = async () => {
    if (!newName.trim() || newName === user.user_full_name) return;

    setLoading(true);
    const result = await updateDisplayName(newName);
    setLoading(false);

    if (result?.error) {
      alert("Failed to update name: " + result.message);
    } else {
      alert("Name updated successfully!");
      setUser({ ...user, user_full_name: newName });
      setIsEditingName(false);
    }
  };

  const handleChangePassword = async () => {
    setError("");

    // Validate input
    if (!oldPassword.trim()) {
      setError("Old password is required.");
      return;
    }
    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters.");
      return;
    }
    if (!/[A-Z]/.test(newPassword) || !/[0-9]/.test(newPassword)) {
      setError(
        "Password must contain at least one uppercase letter and one number."
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
      alert("Password changed successfully!");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setIsChangingPassword(false);
    }
  };

  return (
    <>
      <Container size="sm" py="xl">
        <Card shadow="sm" padding="xl" radius="md" withBorder>
          <LoadingOverlay visible={loading} />
          <Stack align="center">
            {/* Avatar */}
            <Avatar src={user.user_avatar} size={120} radius="xl" />

            {/* User Details */}
            <Title order={2}>{user.user_full_name}</Title>
            <Paper p="md" radius="md" withBorder>
              <Stack>
                <Group>
                  <Text size="md" c="dimmed">
                    <Text component="span" fw={700}>
                      Email:
                    </Text>{" "}
                    {user.user_email}
                  </Text>
                </Group>
                <Group>
                  <Text size="md" c="dimmed">
                    <Text component="span" fw={700}>
                      Role:
                    </Text>{" "}
                    {user.user_role}
                  </Text>
                </Group>
              </Stack>
            </Paper>

            {/* Action Buttons */}
            <Button
              leftSection={<IconUser size={18} />}
              onClick={() => setIsEditingName(true)}
              fullWidth
              variant="light"
            >
              Change Name
            </Button>

            <Button
              leftSection={<IconLock size={18} />}
              onClick={() => setIsChangingPassword(true)}
              fullWidth
              variant="light"
              color="red"
            >
              Change Password
            </Button>

            <Button
              leftSection={<IconArrowLeft size={18} />}
              variant="subtle"
              onClick={() => router.push("/dashboard")}
              fullWidth
            >
              Back to Dashboard
            </Button>
          </Stack>
        </Card>

        {/* Change Name Modal */}
        <Modal
          opened={isEditingName}
          onClose={() => setIsEditingName(false)}
          title="Update Name"
          centered
        >
          <Stack>
            <TextInput
              label="New Name"
              placeholder="Enter new name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              disabled={loading}
            />
            <Button
              onClick={handleUpdateName}
              loading={loading}
              fullWidth
              mt="md"
            >
              Save Changes
            </Button>
          </Stack>
        </Modal>

        {/* Change Password Modal */}
        <Modal
          opened={isChangingPassword}
          onClose={() => setIsChangingPassword(false)}
          title="Change Password"
          centered
        >
          <Stack>
            <TextInput
              type="password"
              label="Old Password"
              placeholder="Enter old password"
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
              label="Confirm New Password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading}
            />
            {error && <Text c="red">{error}</Text>}
            <Button
              onClick={handleChangePassword}
              loading={loading}
              fullWidth
              mt="md"
              color="red"
            >
              Update Password
            </Button>
          </Stack>
        </Modal>
      </Container>
    </>
  );
};

export default ProfilePage;
