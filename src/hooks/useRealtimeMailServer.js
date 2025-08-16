import { useState, useEffect, useRef } from "react";
import io from "socket.io-client";

// Dynamic server URL based on current hostname
const getServerUrl = () => {
  if (
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"
  ) {
    return "http://localhost:3002";
  }
  return `http://${window.location.hostname}:3002`;
};

const SERVER_URL = getServerUrl();

// Hook để kết nối với real-time mail server
export const useRealtimeMailServer = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [mailStats, setMailStats] = useState({
    totalMails: 0,
    newMails: 0,
    dungHanCount: 0,
    quaHanCount: 0,
    dungHanUnreplied: 0,
    quaHanUnreplied: 0,
    lastUpdate: null,
  });
  const [reloadStatus, setReloadStatus] = useState(false);
  const [connectionError, setConnectionError] = useState(null);
  const socketRef = useRef(null);

  useEffect(() => {
    // Initialize socket connection
    const socket = io(SERVER_URL, {
      transports: ["websocket", "polling"],
      timeout: 5000,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketRef.current = socket;

    // Connection event handlers
    socket.on("connect", () => {
      console.log("🔌 Connected to mail server");
      setIsConnected(true);
      setConnectionError(null);

      // Request initial mail stats
      socket.emit("requestMailStats");
    });

    socket.on("disconnect", (reason) => {
      console.log("🔌 Disconnected from mail server:", reason);
      setIsConnected(false);
    });

    socket.on("connect_error", (error) => {
      console.error("❌ Connection error:", error.message);
      setConnectionError(error.message);
      setIsConnected(false);
    });

    // Mail data event handlers
    socket.on("mailStatsUpdate", (stats) => {
      console.log("📊 Mail stats updated:", stats);
      setMailStats(stats);
    });

    socket.on("newMailsDetected", (data) => {
      console.log("🆕 New mails detected:", data);
      // Auto-reload disabled for performance
      // setReloadStatus(data.shouldReload);

      // Show notification - DISABLED
      // if (window.Notification && Notification.permission === 'granted') {
      //   new Notification('📧 New Mail Received!', {
      //     body: `You have ${data.count} new mail(s)`,
      //     icon: '/favicon.ico',
      //     tag: 'new-mail'
      //   });
      // }

      console.log("📊 Auto-reload disabled for performance");
    });

    socket.on("reloadStatusChanged", (data) => {
      console.log("🔄 Reload status changed:", data);
      setReloadStatus(data.shouldReload);
    });

    // Cleanup on unmount
    return () => {
      console.log("🔌 Cleaning up socket connection");
      socket.disconnect();
    };
  }, []);

  // Request notification permission on first load
  useEffect(() => {
    if (window.Notification && Notification.permission === "default") {
      Notification.requestPermission().then((permission) => {
        console.log("🔔 Notification permission:", permission);
      });
    }
  }, []);

  // Functions to interact with server
  const requestMailStats = () => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit("requestMailStats");
    }
  };

  const markMailsAsRead = () => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit("markMailsAsRead");
      setReloadStatus(false);
    }
  };

  const simulateNewMail = async (mailData) => {
    try {
      const response = await fetch(`${SERVER_URL}/api/simulate-new-mail`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(mailData),
      });

      const result = await response.json();

      if (result.success) {
        console.log("✅ New mail simulated successfully:", result.fileName);
        return result;
      } else {
        throw new Error(result.error || "Failed to simulate new mail");
      }
    } catch (error) {
      console.error("❌ Error simulating new mail:", error);
      throw error;
    }
  };

  const setServerReloadStatus = async (shouldReload) => {
    try {
      const response = await fetch(`${SERVER_URL}/api/set-reload-status`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ shouldReload }),
      });

      const result = await response.json();

      if (result.success) {
        console.log("✅ Reload status updated:", result.shouldReload);
        return result;
      } else {
        throw new Error(result.error || "Failed to update reload status");
      }
    } catch (error) {
      console.error("❌ Error updating reload status:", error);
      throw error;
    }
  };

  return {
    // Connection status
    isConnected,
    connectionError,

    // Mail data
    mailStats,
    reloadStatus,

    // Actions
    requestMailStats,
    markMailsAsRead,
    simulateNewMail,
    setServerReloadStatus,
  };
};

// Hook để lấy server health status
export const useServerHealth = () => {
  const [healthData, setHealthData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const checkHealth = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${SERVER_URL}/health`);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setHealthData(data);
      return data;
    } catch (err) {
      setError(err.message);
      console.error("❌ Health check failed:", err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Initial health check
    checkHealth();

    // Periodic health check every 30 seconds
    const interval = setInterval(checkHealth, 30000);

    return () => clearInterval(interval);
  }, []);

  return {
    healthData,
    isLoading,
    error,
    checkHealth,
  };
};
