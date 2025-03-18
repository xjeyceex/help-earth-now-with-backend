import { UserType } from "@/utils/types";
import { create, StateCreator } from "zustand";
import { createJSONStorage, persist, PersistOptions } from "zustand/middleware";

type UserState = {
  user: UserType | null;
  isLoading: boolean;
  setUser: (user: UserType | null) => void;
  clearUser: () => void;
  setLoading: (loading: boolean) => void;
};

type UserPersist = (
  config: StateCreator<UserState>,
  options: PersistOptions<UserState, Partial<UserState>>,
) => StateCreator<UserState>;

export const useUserStore = create<UserState>()(
  (persist as UserPersist)(
    (set) => ({
      user: null,
      isLoading: false,
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null }),
      setLoading: (loading) => set({ isLoading: loading }),
    }),
    {
      name: "user-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
      }),
    },
  ),
);
