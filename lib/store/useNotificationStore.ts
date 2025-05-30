import { create } from 'zustand';

interface NotificationState {
  unreadCount: number;
  setUnreadCount: (count: number) => void;
  decreaseUnreadCount: () => void;
}

const useNotificationStore = create<NotificationState>((set) => ({
  unreadCount: 0,
  setUnreadCount: (count) => set({ unreadCount: count }),
  decreaseUnreadCount: () =>
    set((state) => ({ unreadCount: Math.max(state.unreadCount - 1, 0) })),
}));

export default useNotificationStore;
