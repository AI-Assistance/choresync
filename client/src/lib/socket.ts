import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useAuth } from "@/hooks/use-auth";

interface SocketContextType {
  connected: boolean;
  socket: WebSocket | null;
  sendMessage: (message: any) => void;
}

const SocketContext = createContext<SocketContextType>({
  connected: false,
  socket: null,
  sendMessage: () => {},
});

interface SocketProviderProps {
  children: ReactNode;
}

export function SocketProvider({ children }: SocketProviderProps) {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [connected, setConnected] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    let ws: WebSocket | null = null;

    const connect = () => {
      if (!user) return;

      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const wsUrl = `${protocol}//${window.location.host}/ws?userId=${user.id}`;
      
      ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        console.log("WebSocket connected");
        setConnected(true);
      };

      ws.onclose = () => {
        console.log("WebSocket disconnected");
        setConnected(false);
        
        // Try to reconnect after a delay
        setTimeout(connect, 3000);
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          handleSocketMessage(data);
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
      };

      setSocket(ws);
    };

    connect();

    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [user]);

  const handleSocketMessage = (message: any) => {
    switch (message.type) {
      case "chore_created":
      case "chore_updated":
      case "chore_completed":
        // Notify React Query to refetch relevant data
        window.dispatchEvent(new CustomEvent('refetch-chores'));
        break;
      case "new_notification":
        // Notify to refetch notifications
        window.dispatchEvent(new CustomEvent('refetch-notifications'));
        break;
      default:
        break;
    }
  };

  const sendMessage = (message: any) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(message));
    }
  };

  const value = {
    connected,
    socket,
    sendMessage,
  };

  return React.createElement(SocketContext.Provider, { value }, children);
}

export const useSocket = () => useContext(SocketContext);
