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

const CommentThread: React.FC<CommentThreadProps> = ({ ticket_id }) => {
  const { user } = useUserStore();

  const [comments, setComments] = useState<CommentType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [newComment, setNewComment] = useState<string>("");

  const [editingComment, setEditingComment] = useState<CommentType | null>(
    null
  );
  const [editContent, setEditContent] = useState<string>("");

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

    try {
      setIsLoading(true);
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
      setIsLoading(false);
    }
  };

  const handleDeleteComment = async (comment_id: string) => {
    try {
      setIsLoading(true);
      await deleteComment(comment_id);
      setComments(
        comments.filter((comment) => comment.comment_id !== comment_id)
      );
    } catch (error) {
      console.error("Unexpected error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditComment = async () => {
    if (!editContent.trim()) return;

    try {
      setIsLoading(true);
      if (editingComment) {
        await editComment(editingComment.comment_id, editContent);
        setComments(
          comments.map((comment) =>
            comment.comment_id === editingComment.comment_id
              ? {
                  ...comment,
                  comment_content: editContent,
                  comment_is_edited: true,
                }
              : comment
          )
        );
        setEditingComment(null); // Close modal after successful edit
        setEditContent(""); // Clear edit content
      }
    } catch (error) {
      console.error("Unexpected error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const openEditModal = (comment: CommentType) => {
    setEditingComment(comment);
    setEditContent(comment.comment_content); // Load the existing content for editing
  };

  const closeEditModal = () => {
    setEditingComment(null);
    setEditContent(""); // Clear the input
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
              <Group justify="space-between" style={{ marginBottom: "10px" }}>
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
                    <>
                      <Button
                        variant="outline"
                        color="red"
                        size="xs"
                        onClick={() => handleDeleteComment(comment.comment_id)}
                      >
                        Delete
                      </Button>
                      <Button
                        variant="outline"
                        color="blue"
                        size="xs"
                        onClick={() => openEditModal(comment)}
                      >
                        Edit
                      </Button>
                    </>
                  )}
                </Group>
              </Group>
              <Divider />
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
            disabled={isLoading}
          />
          <Button
            type="submit"
            fullWidth
            disabled={isLoading || !newComment.trim()}
            style={{ marginBottom: "10px" }}
          >
            {isLoading ? "Adding..." : "Add Comment"}
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
          disabled={isLoading || !editContent.trim()}
        >
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </Modal>
    </Container>
  );
};

export default CommentThread;
