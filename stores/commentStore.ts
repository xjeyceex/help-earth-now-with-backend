"use client";

import { CommentType } from "@/utils/types";
import { create } from "zustand";

type CommentStore = {
  comments: CommentType[];
  setComments: (
    comments: CommentType[] | ((prev: CommentType[]) => CommentType[]),
  ) => void;
};

export const useCommentsStore = create<CommentStore>((set) => ({
  comments: [],
  setComments: (comments) =>
    set((state) => ({
      comments:
        typeof comments === "function" ? comments(state.comments) : comments,
    })),
}));
