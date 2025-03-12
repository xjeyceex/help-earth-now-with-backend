import { create, StateCreator } from "zustand";
import { createJSONStorage, persist, PersistOptions } from "zustand/middleware";

export type User = {
  user_id: string;
  user_role: string;
  user_full_name: string;
  user_email: string;
  user_avatar: string;
};

type UserState = {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
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
