import { Container, Nav, Navbar } from "react-bootstrap";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
const NavigationBar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
      } catch (error) {
        console.error("Invalid token", error);
        localStorage.removeItem("token");
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  if (!user) {
    return;
  }

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
