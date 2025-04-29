import { useEffect } from "react";
import { X, CheckCircle, Clock, AlertCircle, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useNotifications } from "@/hooks/use-notifications";
import { format, formatDistanceToNow } from "date-fns";

interface NotificationsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NotificationsPanel({ isOpen, onClose }: NotificationsPanelProps) {
  const { notifications, markAllAsRead, markAsRead, fetchNotifications } = useNotifications();

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen, fetchNotifications]);
  
  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "chore_overdue":
        return <AlertCircle className="text-destructive" />;
      case "chore_completed":
      case "chore_completed_by_other":
        return <CheckCircle className="text-secondary" />;
      case "chore_due_soon":
        return <Clock className="text-accent" />;
      case "chore_assigned":
        return <PlusCircle className="text-primary" />;
      default:
        return <Clock className="text-accent" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "chore_overdue":
        return "border-destructive bg-destructive/5";
      case "chore_completed":
      case "chore_completed_by_other":
        return "border-secondary bg-secondary/5";
      case "chore_due_soon":
        return "border-accent bg-accent/5";
      case "chore_assigned":
        return "border-primary bg-primary/5";
      default:
        return "border-gray-200 bg-gray-50";
    }
  };

  const formatTime = (date: Date | string) => {
    const now = new Date();
    const notificationDate = new Date(date);
    const diffInHours = Math.abs(now.getTime() - notificationDate.getTime()) / 36e5;
    
    if (diffInHours < 24) {
      return formatDistanceToNow(notificationDate, { addSuffix: true });
    }
    
    return format(notificationDate, "MMM d 'at' h:mm a");
  };

  return (
    <div 
      className={cn(
        "fixed inset-y-0 right-0 max-w-sm w-full bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-20",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}
    >
      <div className="flex justify-between items-center border-b border-gray-200 px-6 py-4">
        <h3 className="text-lg font-semibold">Notifications</h3>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-5 w-5" />
          <span className="sr-only">Close</span>
        </Button>
      </div>
      
      <div className="p-4 overflow-y-auto h-full max-h-[calc(100vh-8rem)]">
        {notifications && notifications.length > 0 ? (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div 
                key={notification.id}
                className={cn(
                  "flex p-3 rounded-lg border-l-4",
                  notification.read ? "border-gray-200 bg-gray-50" : getNotificationColor(notification.type)
                )}
                onClick={() => !notification.read && markAsRead(notification.id)}
              >
                <div className="flex-shrink-0 pt-0.5">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="ml-3">
                  <p className={cn(
                    "text-sm font-medium text-gray-900",
                    notification.read && "text-gray-600"
                  )}>
                    {notification.message}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatTime(notification.createdAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No notifications to display</p>
          </div>
        )}
        
        {notifications && notifications.length > 0 && (
          <>
            <Separator className="my-4" />
            <div className="text-center">
              <Button variant="outline" onClick={handleMarkAllAsRead}>
                Mark All as Read
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
