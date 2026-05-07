import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import "bootstrap/dist/css/bootstrap.min.css";
import { useSocket } from "../contexts/SocketContext";
import { Card, Col, Container, Row } from "react-bootstrap";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const HomePage = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);
  const { socket } = useSocket();

  useEffect(() => {
    const getMessages = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/chat/messages");
        if (res.status === 401 || res.status === 403) {
          navigate("/login");
          return;
        }
        if (res.data) {
          setMessages(res.data.messages);
        }
      } catch (err) {
        console.error("Error fetching messages:", error);
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
    } catch (error) {
      console.error("Error sending message:", error);
      setError("Failed to send message. Please try again.");
    }
  };

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col md={10} className="d-flex">
          <Card style={{ backgroundColor: "#dceeff" }}>
            <Card.Body>
              <Card.Title
                className="border border-primary p-3 rounded text-primary text-center fs-3 mb-2"
                style={{ backgroundColor: "#ffffff" }}
              >
                <strong>Chat App</strong>
              </Card.Title>

              <div
                style={{
                  height: "590px",
                  overflowY: "auto",
                  marginBottom: "20px",
                }}
              >
                {messages.map((msg, index) => {
                  if (msg.sender) {
                    if (
                      msg.sender.username ==
                      jwtDecode(localStorage.getItem("token")).username
                    ) {
                      return (
                        <div className="d-flex flex-row justify-content-start">
                          <div key={index}>
                            <p
                              className="border border-primary bg-primary text-white p-2 mb-2 rounded-3 text-wrap"
                              style={{
                                wordBreak: "break-all",
                              }}
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
                          <div className="inline-block flex-row justify-content-center">
                            <div key={index}>
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
                          <div className="d-flex flex-row justify-content-end">
                            <div key={index}>
                              <p
                                className="border border-primary bg-white text-primary p-2 mb-2 rounded-3 text-wrap"
                                style={{
                                  wordBreak: "break-all",
                                }}
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
                      <div className="d-flex flex-row justify-content-end">
                        <div key={index}>
                          <p
                            className="border border-secondary bg-light text-secondary p-2 mb-2 rounded-3 text-wrap"
                            style={{
                              wordBreak: "break-all",
                            }}
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
