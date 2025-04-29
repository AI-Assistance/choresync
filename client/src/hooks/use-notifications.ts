import { useState, useCallback, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { Notification } from "@shared/schema";

export function useNotifications() {
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch all notifications
  const { data: notifications, refetch: fetchNotifications } = useQuery({
    queryKey: ['/api/notifications'],
  });

  // Fetch unread notifications
  const { data: unreadNotifications, refetch: fetchUnreadNotifications } = useQuery({
    queryKey: ['/api/notifications/unread'],
  });

  // Update unread count when unreadNotifications changes
  useEffect(() => {
    if (unreadNotifications) {
      setUnreadCount(unreadNotifications.length);
    }
  }, [unreadNotifications]);

  // Mark a notification as read
  const markAsReadMutation = useMutation({
    mutationFn: async (notificationId: number) => {
      const response = await apiRequest(
        "POST",
        `/api/notifications/${notificationId}/read`,
        {}
      );
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/notifications'] });
      queryClient.invalidateQueries({ queryKey: ['/api/notifications/unread'] });
    },
  });

  // Mark all notifications as read
  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/notifications/read-all", {});
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/notifications'] });
      queryClient.invalidateQueries({ queryKey: ['/api/notifications/unread'] });
    },
  });

  // Listen for WebSocket events to refetch notifications
  useEffect(() => {
    const handleRefetchNotifications = () => {
      fetchNotifications();
      fetchUnreadNotifications();
    };

    window.addEventListener('refetch-notifications', handleRefetchNotifications);

    return () => {
      window.removeEventListener('refetch-notifications', handleRefetchNotifications);
    };
  }, [fetchNotifications, fetchUnreadNotifications]);

  const markAsRead = useCallback(
    async (notificationId: number) => {
      await markAsReadMutation.mutateAsync(notificationId);
    },
    [markAsReadMutation]
  );

  const markAllAsRead = useCallback(async () => {
    await markAllAsReadMutation.mutateAsync();
  }, [markAllAsReadMutation]);

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    fetchNotifications,
    isLoading: markAsReadMutation.isPending || markAllAsReadMutation.isPending,
  };
}
