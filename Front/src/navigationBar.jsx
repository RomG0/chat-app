import { Container, Nav, Navbar } from "react-bootstrap";
import { useNavigate } from "react-router";
import axios from "axios";
import { useSocket } from "./contexts/SocketContext";

const NavigationBar = () => {
  const navigate = useNavigate();
  const { user, setUser } = useSocket();

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:5000/api/auth/logout");
    } catch {}
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  if (!user) return null;

  return (
    <Navbar className="bg-body-tertiary" expand="lg">
      <Container>
        <Navbar.Brand>
          Hello, <strong>{user.username}</strong>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/">Home</Nav.Link>

            {user.isAdmin && (
              <Nav.Link href="/admin" className="text-danger fw-bold">
                Admin Panel
              </Nav.Link>
            )}
          </Nav>

          <Nav>
            <Nav.Link onClick={handleLogout} style={{ cursor: "pointer" }}>
              Logout
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;
