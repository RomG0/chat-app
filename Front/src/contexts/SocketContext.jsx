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
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    if (!token) return;

    if (socketRef.current) return;

    const newSocket = io("http://localhost:5000", {
      auth: { token },
    });

    newSocket.on("connect_error", (err) => {
      console.error("Socket connection error:", err.message);
      if (err.message.includes("Authentication error")) {
        localStorage.removeItem("token");
        setSocket(null);
        setToken(null);
      }
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
  }, [token]);

  return (
    <SocketContext.Provider value={{ socket, token, setToken }}>
      {children}
    </SocketContext.Provider>
  );
};
