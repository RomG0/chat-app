import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import io from "socket.io-client";

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const socketRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("SocketProvider mount, token:", token);

    if (!token) {
      console.log("No token, skipping socket connection");
      return;
    }

    const newSocket = io("http://localhost:5000", {
      auth: { token },
    });

    if (socketRef.current) {
      console.log("Socket already initialized");
      return;
    }

    newSocket.on("connect_error", (err) => {
      console.error("Socket connection error:", err.message);
      if (err.message === "Authentication error") {
        localStorage.removeItem("token");
        setSocket(null);
      }
      return;
    });

    newSocket.on("connect", () => {
      console.log("Socket connected:", newSocket.id);
      setSocket(newSocket);
      socketRef.current = newSocket;
    });

    return () => {
      if (newSocket) {
        console.log("Disconnecting socket:", newSocket.id);
        newSocket.disconnect();
        socketRef.current = null;
      }
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
