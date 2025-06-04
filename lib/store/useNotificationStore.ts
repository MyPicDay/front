import { create } from 'zustand';

interface NotificationState {
  unreadCount: number;
  setUnreadCount: (count: number | ((prev: number) => number)) => void;
  decreaseUnreadCount: () => void;
}

const useNotificationStore = create<NotificationState>((set) => ({
  unreadCount: 0,
  setUnreadCount: (countOrUpdater) =>
    set((state) => ({
      unreadCount:
        typeof countOrUpdater === 'function'
          ? (countOrUpdater as (prev: number) => number)(state.unreadCount)
          : countOrUpdater,
    })),
  decreaseUnreadCount: () =>
    set((state) => ({ unreadCount: Math.max(state.unreadCount - 1, 0) })),
}));

export default useNotificationStore;
