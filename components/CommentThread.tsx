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
  Group,
  Loader,
  Menu,
  Modal,
  Paper,
  Text,
} from "@mantine/core";
import { IconDotsVertical, IconEdit, IconTrash } from "@tabler/icons-react";
import DOMPurify from "dompurify";
import React, { useEffect, useRef, useState } from "react";
import LoadingStateProtected from "./LoadingStateProtected";

import {
  RichTextEditor,
  RichTextEditorRef,
} from "@/components/ui/RichTextEditor";

type CommentThreadProps = {
  ticket_id: string;
};

const CommentThread: React.FC<CommentThreadProps> = ({ ticket_id }) => {
  const { user } = useUserStore();
  const commentEditorRef = useRef<RichTextEditorRef>(null);

  const { comments, setComments } = useCommentsStore();
  const [newComment, setNewComment] = useState<string>("");

  const [editingComment, setEditingComment] = useState<CommentType | null>(
    null,
  );
  const [editContent, setEditContent] = useState<string>("");

  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>(
    {},
  );
  const [isAddingComment, setIsAddingComment] = useState<boolean>(false);
  const [deletingComment, setDeletingComment] = useState<CommentType | null>(
    null,
  );
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);

  const cleanComment = newComment.trim();

  useEffect(() => {
    if (!user || !ticket_id) return;

    const channelName = `comment_changes_${ticket_id}`;
    const client = createClient();
    const channel = client.channel(channelName);

    channel
      .on<CommentType>(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "comment_table",
          filter: `comment_ticket_id=eq.${ticket_id}`,
        },
        async (payload) => {
          if (!payload || !("eventType" in payload)) {
            console.warn("Received unexpected payload:", payload);
            return;
          }

          if (payload.eventType === "INSERT") {
            const { data: newComment, error } = await createClient()
              .from("comment_with_avatar_view")
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
                  : comment,
              ),
            );
          }

          if (payload.eventType === "DELETE") {
            setComments((prev) =>
              prev.filter(
                (comment) => comment.comment_id !== payload.old?.comment_id,
              ),
            );
          }
        },
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

    if (cleanComment === "<p></p>" || cleanComment === "") {
      return;
    }

    setIsAddingComment(true);

    try {
      await addComment(ticket_id, newComment, user.user_id);

      setNewComment("");
      commentEditorRef.current?.reset();
    } catch (error) {
      console.error("Unexpected error:", error);
    } finally {
      setIsAddingComment(false);
    }
  };

  const handleDeleteComment = async () => {
    if (deletingComment) {
      try {
        await deleteComment(deletingComment.comment_id);
        setComments((prevComments) =>
          prevComments.filter(
            (comment) => comment.comment_id !== deletingComment.comment_id,
          ),
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
            : comment,
        ),
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
    <Container w="100%" pt="xs">
      {comments.length === 0 ? (
        <Text>No comments yet.</Text>
      ) : (
        <div>
          {comments.map((comment) => (
            <Paper
              key={comment.comment_id}
              p="xs"
              bg="transparent"
              style={{ boxShadow: "none" }}
            >
              {loadingStates[comment.comment_id] ? (
                <Container
                  style={{ display: "flex", justifyContent: "center" }}
                >
                  <Loader size="sm" />
                </Container>
              ) : (
                <Group
                  justify="space-between"
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "flex-start",
                    marginBottom: 0, // No bottom margin to reduce excess space
                  }}
                >
                  <Group
                    gap="xs"
                    style={{
                      display: "flex",
                      flex: 1,
                      alignItems: "flex-start",
                    }}
                  >
                    <Avatar
                      src={comment.comment_user_avatar}
                      radius="xl"
                      size="md"
                    />
                    <Box style={{ flex: 1, marginLeft: "4px" }}>
                      <Group gap="xs" align="flex-start">
                        <Text size="sm" fw="500" style={{ marginRight: 10 }}>
                          {comment.comment_user_full_name}
                        </Text>
                        <Text size="xs" c="dimmed">
                          {new Date(
                            comment.comment_date_created,
                          ).toLocaleString()}
                        </Text>
                        <Text size="xs" c="dimmed">
                          {comment.comment_is_edited && "(Edited)"}
                        </Text>
                      </Group>

                      <Text
                        size="md"
                        style={{
                          wordBreak: "break-word",
                          maxWidth: "100%",
                          marginTop: "4px",
                        }}
                      >
                        <span
                          dangerouslySetInnerHTML={{
                            __html: DOMPurify.sanitize(comment.comment_content),
                          }}
                        />
                      </Text>
                    </Box>
                  </Group>

                  {user?.user_id === comment.comment_user_id && (
                    <Menu trigger="click" position="bottom-end">
                      <Menu.Target>
                        <ActionIcon
                          variant="transparent"
                          style={{
                            color: "inherit",
                            marginLeft: "auto",
                          }}
                        >
                          <IconDotsVertical size={18} />
                        </ActionIcon>
                      </Menu.Target>

                      <Menu.Dropdown>
                        <Menu.Item
                          leftSection={<IconEdit size={16} />}
                          onClick={() => openEditModal(comment)}
                          disabled={loadingStates[comment.comment_id]}
                        >
                          Edit
                        </Menu.Item>
                        <Menu.Item
                          leftSection={<IconTrash size={16} />}
                          onClick={() => openDeleteModal(comment)}
                          disabled={loadingStates[comment.comment_id]}
                        >
                          Delete
                        </Menu.Item>
                      </Menu.Dropdown>
                    </Menu>
                  )}
                </Group>
              )}
            </Paper>
          ))}
        </div>
      )}

      <Paper p="md" shadow="xs" style={{ marginBottom: "20px" }}>
        <form onSubmit={handleAddComment}>
          <RichTextEditor
            ref={commentEditorRef} // Add the ref if needed for the editor
            value={newComment} // Set the value from state
            onChange={(value) => {
              setNewComment(value); // Update the state on change
            }}
          />
          <Button
            type="submit"
            fullWidth
            disabled={
              isAddingComment ||
              cleanComment === "<p></p>" ||
              cleanComment === ""
            }
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
        size="xl" // Use 'lg' for a larger modal
      >
        <form onSubmit={handleEditComment}>
          <RichTextEditor
            ref={commentEditorRef} // Add a separate ref for the editor in the modal
            value={editContent} // Set the value from the edit state
            onChange={(value) => setEditContent(value)} // Update the edit state on change
          />
          <Button
            fullWidth
            onClick={handleEditComment}
            disabled={
              !editContent.trim() ||
              loadingStates[editingComment?.comment_id || ""]
            }
            style={{ marginTop: "10px" }}
          >
            {loadingStates[editingComment?.comment_id || ""] ? (
              <Loader size="xs" />
            ) : (
              "Save Changes"
            )}
          </Button>
        </form>
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
