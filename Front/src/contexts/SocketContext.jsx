import { createContext, useContext, useState, useEffect, useRef } from "react";
import io from "socket.io-client";

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);

  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }

  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const socketRef = useRef(null);
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user") || "null"),
  );

  useEffect(() => {
    if (!user) return;

    const newSocket = io("https://localhost:5000", {
      withCredentials: true,
    });

    newSocket.on("connect_error", (err) => {
      console.error("Socket connection error:", err.message);
    });

    newSocket.on("connect", () => {
      setSocket(newSocket);
      socketRef.current = newSocket;
    });

    return () => {
      newSocket.disconnect();
      socketRef.current = null;
      setSocket(null);
    };
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket, user, setUser }}>
      {children}
    </SocketContext.Provider>
  );
};
