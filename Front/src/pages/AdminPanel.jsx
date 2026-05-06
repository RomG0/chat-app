import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { useSocket } from "../contexts/SocketContext";
import axios from "axios";

const AdminPanel = () => {
  const navigate = useNavigate();
  const { socket } = useSocket();

  const [connectedUsers, setConnectedUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);

  const getAllUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/getUsers", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (res.status === 200) {
        setAllUsers(res.data.users);
      }
      if (res.status === 403) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    } catch (err) {
      console.error("Error fetching all users:", err);
    }
  };

  const deleteUser = async (qUserId) => {
    const res = await fetch(`http://localhost:5000/api/admin/user/${qUserId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    if (res.status === 200) {
      setAllUsers((prevUsers) => prevUsers.filter((u) => u._id !== qUserId));
      setConnectedUsers((prevUsers) =>
        prevUsers.filter((u) => u.userId !== qUserId),
      );
    } else if (res.status === 404 || res.status === 400 || res.status === 500) {
      console.error("Error deleting user:", res.status, res.message);
    }
  };

  const giveAdmin = async (qUserId) => {
    const res = await fetch(`http://localhost:5000/api/admin/user/${qUserId}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    if (res.status === 200) {
      console.log("User is now an admin");
    }
  };

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
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

    getAllUsers();

    socket.on("error", (err) => {
      console.error("Socket error:", err);
      if (err.message === "Unauthorized") {
        localStorage.removeItem("token");
        navigate("/login");
      }
    });
  }, [navigate, socket]);

  const nonConnectedUsers = allUsers.filter(
    (dbuser) => !connectedUsers.some((cUser) => cUser.userId === dbuser._id),
  );
  // YZ: why admin can delete only connected users?
  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card" style={{ backgroundColor: "#dceeff" }}>
            <div className="card-body flex flex-col h-96">
              <h2
                className="card-title border border-primary p-3 rounded text-primary text-center fs-3 mb-2"
                style={{ backgroundColor: "#ffffff" }}
              >
                <strong>Admin Panel</strong>
              </h2>
              <h5 className="mb-2 text-center text-primary">Connected Users</h5>
              {connectedUsers ? (
                <ul className="list-group">
                  {connectedUsers.map((user, index) => (
                    <li key={index} className="list-group-item">
                      <p className="mb-0 float-start fw-bold">
                        {user.username}
                      </p>
                      {user.isAdmin && (
                        <span className="badge bg-secondary ms-2">Admin</span>
                      )}
                      {!user.isAdmin && (
                        <button
                          className="adminButton btn btn-sm btn-outline-primary float-end me-2"
                          onClick={() => {
                            giveAdmin(user.userId);
                          }}
                        >
                          Make Admin
                        </button>
                      )}
                      <button
                        className="deleteButton btn btn-sm btn-outline-danger float-end"
                        onClick={() => {
                          deleteUser(user.userId);
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
              <h5 className="mt-3 mb-2 text-center text-primary">
                Non-connected Users
              </h5>
              {nonConnectedUsers ? (
                <ul className="list-group">
                  {nonConnectedUsers.map((user, index) => (
                    <li key={index} className="list-group-item">
                      <p className="mb-0 float-start fw-bold">
                        {user.username}
                      </p>
                      {user.isAdmin && (
                        <span className="badge bg-secondary ms-2">Admin</span>
                      )}
                      {!user.isAdmin && (
                        <button
                          className="adminButton btn btn-sm btn-outline-primary float-end"
                          onClick={() => {
                            giveAdmin(user._id);
                          }}
                        >
                          Make Admin
                        </button>
                      )}
                      <button
                        className="deleteButton btn btn-sm btn-outline-danger float-end"
                        onClick={() => {
                          deleteUser(user._id);
                        }}
                      >
                        Delete
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No non-connected users.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
