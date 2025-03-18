"use client";

import { NotificationType } from "@/utils/types";
import { create } from "zustand";

interface NotificationStore {
  notifications: NotificationType[];
  setNotifications: (
    notifications:
      | NotificationType[]
      | ((prev: NotificationType[]) => NotificationType[])
  ) => void;
}

export const useNotificationStore = create<NotificationStore>((set) => ({
  notifications: [],
  setNotifications: (notifications) =>
    set((state) => ({
      notifications:
        typeof notifications === "function"
          ? notifications(state.notifications)
          : notifications,
    })),
}));
