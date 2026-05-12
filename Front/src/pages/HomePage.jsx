import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import "bootstrap/dist/css/bootstrap.min.css";
import { useSocket } from "../contexts/SocketContext";
import { Card, Col, Container, Row } from "react-bootstrap";
import axios from "axios";

const HomePage = () => {
  const navigate = useNavigate();
  const { socket, user } = useSocket();
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getMessages = async () => {
      try {
        const res = await axios.get("https://localhost:5000/api/chat/messages");
        if (res.data) {
          setMessages(res.data.messages);
        }
      } catch (err) {
        if (err.response?.status === 401 || err.response?.status === 403) {
          navigate("/login");
          return;
        }
        console.error("Error fetching messages:", err);
        setError("Could not load messages.");
      }
    };

    getMessages();

    if (!socket) return;

    const handleNewMessage = (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [navigate, socket]);

  const sendMessage = (e) => {
    e.preventDefault();
    setError(null);

    try {
      socket.emit("sendMessage", {
        content: e.target.messageInput.value,
      });
      e.target.messageInput.value = "";
    } catch (err) {
      console.error("Error sending message:", err);
      setError("Failed to send message. Please try again.");
    }
  };

  return (
    <Container fluid className="vh-100 d-flex flex-column p-3 p-md-5">
      <Row className="justify-content-center align-items-center h-100">
        <Col xs={12} sm={10} md={8} lg={6} className="h-100 d-flex flex-column">
          <Card className="flex-grow-1" style={{ backgroundColor: "#dceeff" }}>
            <Card.Body className="d-flex flex-column h-100">
              <Card.Title
                className="border border-primary p-3 rounded text-primary text-center fs-3 mb-2"
                style={{ backgroundColor: "#ffffff" }}
              >
                <strong>Chat App</strong>
              </Card.Title>

              {error && <p style={{ color: "red" }}>{error}</p>}

              <div
                className="flex-grow-1 p-2"
                style={{
                  overflowY: "auto",
                  marginBottom: "20px",
                }}
              >
                {messages.map((msg, index) => {
                  if (msg.sender) {
                    if (msg.sender.username === user?.username) {
                      return (
                        <div
                          key={index}
                          className="d-flex flex-row justify-content-start"
                        >
                          <div>
                            <p
                              className="border border-primary bg-primary text-white p-2 mb-2 rounded-3 text-wrap"
                              style={{ wordBreak: "break-all" }}
                            >
                              <strong>{msg.sender.username}:</strong>{" "}
                              {msg.content}
                            </p>
                          </div>
                        </div>
                      );
                    } else {
                      if (msg.sender.isAdmin) {
                        return (
                          <div
                            key={index}
                            className="inline-block flex-row justify-content-center"
                          >
                            <div>
                              <p
                                className="border border-danger text-danger p-2 mb-2 rounded-3 text-wrap"
                                style={{
                                  backgroundColor: "#fce1e1",
                                  wordBreak: "break-all",
                                }}
                              >
                                <strong>{msg.sender.username} (Admin):</strong>{" "}
                                {msg.content}
                              </p>
                            </div>
                          </div>
                        );
                      } else {
                        return (
                          <div
                            key={index}
                            className="d-flex flex-row justify-content-end"
                          >
                            <div>
                              <p
                                className="border border-primary bg-white text-primary p-2 mb-2 rounded-3 text-wrap"
                                style={{ wordBreak: "break-all" }}
                              >
                                <strong>{msg.sender.username}:</strong>{" "}
                                {msg.content}
                              </p>
                            </div>
                          </div>
                        );
                      }
                    }
                  } else {
                    return (
                      <div
                        key={index}
                        className="d-flex flex-row justify-content-end"
                      >
                        <div>
                          <p
                            className="border border-secondary bg-light text-secondary p-2 mb-2 rounded-3 text-wrap"
                            style={{ wordBreak: "break-all" }}
                          >
                            <strong>Deleted User:</strong> {msg.content}
                          </p>
                        </div>
                      </div>
                    );
                  }
                })}
              </div>
              <form onSubmit={sendMessage} className="mt-3">
                <div className="d-flex">
                  <input
                    name="messageInput"
                    type="text"
                    placeholder="Type your message..."
                    className="form-control"
                  />
                  <button type="submit" className="btn btn-primary ml-2">
                    Send
                  </button>
                </div>
              </form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default HomePage;
