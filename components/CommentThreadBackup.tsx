import { deleteComment } from "@/actions/delete";
import { getComments } from "@/actions/get";
import { addComment } from "@/actions/post";
import { editComment } from "@/actions/update";
import { useUserStore } from "@/stores/userStore";
import { CommentType } from "@/utils/types";
import {
  Avatar,
  Box,
  Button,
  Container,
  Divider,
  Group,
  Loader,
  Modal,
  Paper,
  Text,
  Textarea,
} from "@mantine/core";
import React, { useEffect, useState } from "react";

type CommentThreadProps = {
  ticket_id: string; // The ticket ID for which comments are fetched
};

const CommentThreadBackup: React.FC<CommentThreadProps> = ({ ticket_id }) => {
  const { user } = useUserStore();

  const [comments, setComments] = useState<CommentType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
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

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setIsLoading(true);
        const fetchedComments = await getComments(ticket_id);
        setComments(fetchedComments);
      } catch (error) {
        console.error("Unexpected error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchComments();
  }, [ticket_id]);

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      console.error("User not logged in.");
      return;
    }
    if (!newComment.trim()) return; // Prevent adding empty comments

    setIsAddingComment(true); // Disable the form

    try {
      const commentId = await addComment(ticket_id, newComment, user.user_id);
      setComments([
        ...comments,
        {
          comment_id: commentId,
          comment_ticket_id: ticket_id,
          comment_user_id: user.user_id,
          comment_content: newComment,
          comment_date_created: new Date().toISOString(),
          comment_is_edited: false,
          comment_type: "COMMENT",
          comment_user_full_name: user.user_full_name,
          comment_user_avatar: user?.user_avatar,
          comment_last_updated: new Date().toISOString(),
          replies: [],
        },
      ]);
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

  if (isLoading) {
    return (
      <Container style={{ display: "flex", justifyContent: "center" }}>
        <Loader size="lg" />
      </Container>
    );
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
                                comment.comment_date_created,
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
                        <>
                          <Button
                            variant="outline"
                            color="red"
                            size="xs"
                            onClick={() => openDeleteModal(comment)} // Open the delete confirmation modal
                            disabled={loadingStates[comment.comment_id]}
                          >
                            Delete
                          </Button>
                          <Button
                            variant="outline"
                            color="blue"
                            size="xs"
                            onClick={() => openEditModal(comment)}
                            disabled={loadingStates[comment.comment_id]}
                          >
                            Edit
                          </Button>
                        </>
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
            disabled={isAddingComment || isLoading} // Disable while adding or loading
          />
          <Button
            type="submit"
            fullWidth
            disabled={isAddingComment || isLoading || !newComment.trim()}
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
            isLoading ||
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

export default CommentThreadBackup;
