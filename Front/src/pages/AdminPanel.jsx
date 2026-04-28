import React, { use } from "react";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { useSocket } from "../contexts/SocketContext";

const AdminPanel = () => {
  const navigate = useNavigate();
  const [connectedUsers, setConnectedUsers] = useState(null);
  const socket = useSocket();

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
      return;
    }

    console.log("use effect ran, token exists, socket:", socket);

    if (!socket) return;

    console.log("socket exists!");

    socket.emit("getConnectedUsers");

    console.log("Tried to get connected users!");

    socket.on("connectedUsers", (users) => {
      setConnectedUsers(users);
      console.log("Received connected users!", users);
    });

    socket.on("error", (err) => {
      console.error("Socket error:", err);
      if (err.message === "Unauthorized") {
        localStorage.removeItem("token");
        navigate("/login");
      }
    });

    const deleteUser = (username) => {
      fetch(`http://localhost:5000/api/admin/${username}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }).then((res) => {
        if (res.status === 200) {
          setConnectedUsers((prevUsers) =>
            prevUsers.filter((u) => u.username !== username),
          );
        } else if (
          res.status === 404 ||
          res.status === 400 ||
          res.status === 500
        ) {
          console.error("Error deleting user:", res.status, res.message);
        }
      });
    };
  }, [navigate, socket]);

  return (
    <div className="container my-5">
      <h5 className="mb-4">Admin Panel - Connected Users</h5>
      {connectedUsers ? (
        <ul className="list-group">
          {connectedUsers.map((user, index) => (
            <li key={index} className="list-group-item">
              {user.username}
              <button
                className="deleteButton btn btn-sm btn-outline-danger float-end"
                onClick={() => {
                  deleteUser(user.username);
                }}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No connected users.</p>
      )}
    </div>
  );
};

export default AdminPanel;
