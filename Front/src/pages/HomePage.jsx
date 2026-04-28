import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import "bootstrap/dist/css/bootstrap.min.css";
import { useSocket } from "../contexts/SocketContext";

const HomePage = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);
  const socket = useSocket();

  const token = localStorage.getItem("token");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    if (!socket) return;

    // Fetch messages
    fetch("http://localhost:5000/api/chat/messages", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (res.status === 401 || res.status === 403) {
          localStorage.removeItem("token");
          navigate("/login");
          return;
        }
        return res.json();
      })
      .then((data) => {
        if (data) {
          setMessages(data.messages);
        }
      })
      .catch((error) => {
        console.error("Error fetching messages:", error);
      });

    // Listen for new messages
    socket.on("newMessage", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });
  }, [navigate, socket]);

  const sendMessage = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      socket.emit("sendMessage", {
        content: e.target.messageInput.value,
      });
      e.target.messageInput.value = "";
    } catch (error) {
      console.error("Error sending message:", error);
      setError("Failed to send message. Please try again.");
    }
  };

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card" style={{ backgroundColor: "#dceeff" }}>
            <div className="card-body flex flex-col h-96">
              <h5
                className="card-title border border-primary p-3 rounded text-primary text-center fs-3 mb-2"
                style={{ backgroundColor: "#ffffff" }}
              >
                <strong>Chat App</strong>
              </h5>

              <div className="messages flex-1 overflow-y-auto">
                {messages.map((msg, index) => {
                  if (msg.sender.isAdmin) {
                    return (
                      <div
                        key={index}
                        className="message border border-danger rounded p-2 mb-2 w-fit max-w-full break-words bg-danger text-white"
                      >
                        <strong>{msg.sender.username} (Admin):</strong>{" "}
                        {msg.content}
                      </div>
                    );
                  } else {
                    return (
                      <div
                        key={index}
                        className="message border border-primary rounded p-2 mb-2 w-fit max-w-full inline-block break-words bg-primary text-white"
                      >
                        <strong>{msg.sender.username}:</strong> {msg.content}
                      </div>
                    );
                  }
                })}
              </div>
              <form onSubmit={sendMessage} className="newMessageForm mt-3">
                <div className="newMessage d-flex">
                  <input
                    type="text"
                    name="messageInput"
                    placeholder="Type your message..."
                    className="form-control"
                  />
                  <button type="submit" className="btn btn-primary ml-2">
                    Send
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
