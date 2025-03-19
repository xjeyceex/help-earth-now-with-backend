import { deleteComment } from "@/actions/delete";
import { addComment } from "@/actions/post";
import { editComment } from "@/actions/update";
import { useCommentsStore } from "@/stores/commentStore";
import { useUserStore } from "@/stores/userStore";
import { createClient } from "@/utils/supabase/client";
import { CommentType } from "@/utils/types";
import {
  ActionIcon,
  Avatar,
  Box,
  Button,
  Container,
  Divider,
  Group,
  Loader,
  Menu,
  Modal,
  Paper,
  Text,
  Textarea,
} from "@mantine/core";
import { IconDotsVertical, IconEdit, IconTrash } from "@tabler/icons-react";
import React, { useEffect, useState } from "react";
import LoadingStateProtected from "./LoadingStateProtected";

type CommentThreadProps = {
  ticket_id: string;
};

const CommentThread: React.FC<CommentThreadProps> = ({ ticket_id }) => {
  const { user } = useUserStore();

  const { comments, setComments } = useCommentsStore();
  const [newComment, setNewComment] = useState<string>("");

  const [editingComment, setEditingComment] = useState<CommentType | null>(
    null
  );
  const [editContent, setEditContent] = useState<string>("");

  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>(
    {}
  );
  const [isAddingComment, setIsAddingComment] = useState<boolean>(false);
  const [deletingComment, setDeletingComment] = useState<CommentType | null>(
    null
  );
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);

  useEffect(() => {
    if (!user || !ticket_id) return;

    const channelName = `comment_changes_${ticket_id}`;
    const client = createClient();
    const channel = client.channel(channelName);

    channel
      .on<CommentType>(
        "postgres_changes",
        {
          event: "*", // Listen to all events
          schema: "public",
          table: "comment_table", // Subscribe to the actual table
          filter: `comment_ticket_id=eq.${ticket_id}`,
        },
        async (payload) => {
          if (!payload || !("eventType" in payload)) {
            console.warn("Received unexpected payload:", payload);
            return;
          }

          if (payload.eventType === "INSERT") {
            // Fetch the new comment WITH avatar and name
            const { data: newComment, error } = await createClient()
              .from("comment_with_avatar_view") // Fetch from the view
              .select("*")
              .eq("comment_id", payload.new.comment_id)
              .single();

            if (error) {
              console.error("Error fetching new comment:", error.message);
              return;
            }

            // Append new comment at the end instead of the beginning
            setComments((prev) => [...prev, newComment]);
          }

          if (payload.eventType === "UPDATE") {
            setComments((prev) =>
              prev.map((comment) =>
                comment.comment_id === payload.new.comment_id
                  ? { ...comment, ...payload.new }
                  : comment
              )
            );
          }

          if (payload.eventType === "DELETE") {
            setComments((prev) =>
              prev.filter(
                (comment) => comment.comment_id !== payload.old?.comment_id
              )
            );
          }
        }
      )
      .subscribe((status, err) => {
        if (err) {
          console.error("Subscription error:", err);
        }
      });

    return () => {
      client.removeChannel(channel);
    };
  }, [user, ticket_id, setComments]);

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      console.error("User not logged in.");
      return;
    }
    if (!newComment.trim()) return; // Prevent adding empty comments

    setIsAddingComment(true); // Disable the form

    try {
      await addComment(ticket_id, newComment, user.user_id);

      setNewComment(""); // Clear the input after adding
    } catch (error) {
      console.error("Unexpected error:", error);
    } finally {
      setIsAddingComment(false); // Re-enable the form
    }
  };

  const handleDeleteComment = async () => {
    if (deletingComment) {
      try {
        await deleteComment(deletingComment.comment_id);
        setComments((prevComments) =>
          prevComments.filter(
            (comment) => comment.comment_id !== deletingComment.comment_id
          )
        );
      } catch (error) {
        console.error("Unexpected error:", error);
      }
      setIsDeleteModalOpen(false); // Close the delete confirmation modal
      setDeletingComment(null); // Reset the deleting comment
    }
  };

  const handleEditComment = async () => {
    if (!editContent.trim() || !editingComment) return;

    try {
      setLoadingStates((prev) => ({
        ...prev,
        [editingComment.comment_id]: true,
      }));
      await editComment(editingComment.comment_id, editContent);
      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment.comment_id === editingComment.comment_id
            ? {
                ...comment,
                comment_content: editContent,
                comment_is_edited: true,
              }
            : comment
        )
      );
      setEditingComment(null);
      setEditContent("");
    } catch (error) {
      console.error("Unexpected error:", error);
    } finally {
      setLoadingStates((prev) => ({
        ...prev,
        [editingComment.comment_id]: false,
      }));
    }
  };

  const openDeleteModal = (comment: CommentType) => {
    setDeletingComment(comment);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeletingComment(null);
  };

  const openEditModal = (comment: CommentType) => {
    setEditingComment(comment);
    setEditContent(comment.comment_content);
  };

  const closeEditModal = () => {
    setEditingComment(null);
    setEditContent("");
  };

  if (!comments) {
    return <LoadingStateProtected />;
  }

  return (
    <Container w="100%" mt="md">
      {comments.length === 0 ? (
        <Text>No comments yet.</Text>
      ) : (
        <div>
          {comments.map((comment) => (
            <Paper
              key={comment.comment_id}
              p="md"
              shadow="xs"
              style={{ marginBottom: "15px" }}
            >
              {loadingStates[comment.comment_id] ? (
                <Container
                  style={{ display: "flex", justifyContent: "center" }}
                >
                  <Loader size="sm" />
                </Container>
              ) : (
                <>
                  <Group
                    justify="space-between"
                    style={{ marginBottom: "10px" }}
                  >
                    <Box>
                      <Group gap="xs" pb="sm" align="center">
                        <Avatar
                          src={comment.comment_user_avatar}
                          radius="xl"
                          size="md"
                        />
                        <Box>
                          <Group gap={5}>
                            <Text
                              size="xs"
                              style={{ marginRight: 10, fontWeight: 500 }}
                            >
                              {comment.comment_user_full_name}
                            </Text>
                            <Text size="xs" c="dimmed">
                              {new Date(
                                comment.comment_date_created
                              ).toLocaleString()}
                            </Text>
                          </Group>
                          <Text style={{ marginTop: 10 }}>
                            <strong>{comment.comment_content}</strong>
                          </Text>
                        </Box>
                      </Group>

                      <Text size="sm" c="dimmed">
                        {comment.comment_is_edited && " (Edited)"}
                      </Text>
                    </Box>

                    <Group gap="xs">
                      {user?.user_id === comment.comment_user_id && (
                        <Menu trigger="click" position="bottom-end">
                          <Menu.Target>
                            <ActionIcon
                              variant="transparent"
                              style={{ color: "inherit" }}
                            >
                              <IconDotsVertical size={18} />
                            </ActionIcon>
                          </Menu.Target>

                          <Menu.Dropdown>
                            <Menu.Item
                              leftSection={<IconEdit size={16} />} // Edit icon using leftSection
                              onClick={() => openEditModal(comment)} // Open the edit modal
                              disabled={loadingStates[comment.comment_id]}
                            >
                              Edit
                            </Menu.Item>
                            <Menu.Item
                              leftSection={<IconTrash size={16} />} // Trash icon using leftSection
                              onClick={() => openDeleteModal(comment)} // Open the delete confirmation modal
                              disabled={loadingStates[comment.comment_id]}
                            >
                              Delete
                            </Menu.Item>
                          </Menu.Dropdown>
                        </Menu>
                      )}
                    </Group>
                  </Group>
                  <Divider />
                </>
              )}
            </Paper>
          ))}
        </div>
      )}

      <Paper p="md" shadow="xs" style={{ marginBottom: "20px" }}>
        <form onSubmit={handleAddComment}>
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            rows={4}
            style={{ width: "100%", marginBottom: "10px" }}
            disabled={isAddingComment} // Disable while adding or loading
          />
          <Button
            type="submit"
            fullWidth
            disabled={isAddingComment || !newComment.trim()}
            style={{ marginBottom: "10px" }}
          >
            {isAddingComment ? <Loader size="xs" /> : "Add Comment"}
          </Button>
        </form>
      </Paper>

      {/* Edit Comment Modal */}
      <Modal
        opened={!!editingComment}
        onClose={closeEditModal}
        title="Edit Comment"
        centered
      >
        <Textarea
          value={editContent}
          onChange={(e) => setEditContent(e.target.value)}
          placeholder="Edit your comment..."
          rows={4}
          style={{ width: "100%", marginBottom: "10px" }}
        />
        <Button
          fullWidth
          onClick={handleEditComment}
          disabled={
            !editContent.trim() ||
            loadingStates[editingComment?.comment_id || ""]
          }
        >
          {loadingStates[editingComment?.comment_id || ""] ? (
            <Loader size="xs" />
          ) : (
            "Save Changes"
          )}
        </Button>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        opened={isDeleteModalOpen}
        onClose={closeDeleteModal}
        title="Are you sure?"
        centered
      >
        <Text>
          Do you really want to delete this comment? This action cannot be
          undone.
        </Text>
        <Group align="center" justify="center" mt="md">
          <Button variant="outline" color="gray" onClick={closeDeleteModal}>
            Cancel
          </Button>
          <Button color="red" onClick={handleDeleteComment}>
            Delete
          </Button>
        </Group>
      </Modal>
    </Container>
  );
};

export default CommentThread;
