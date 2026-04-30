import {Container, Nav, Navbar, NavDropdown} from "react-bootstrap";
import { useNavigate } from "react-router";
import axios from "axios";

const NavigationBar = () => {
  const navigate = useNavigate();

    const handleLogout = () => {
      localStorage.removeItem("token");
      navigate("/login");
    };

    const token = localStorage.getItem("token");

    axios.get("http://localhost:5000/api/auth/current", {
        body: { token: token },
      })
      .then((res) => {
        const user = res.data.user;
      });

    return (
        <Navbar className="bg-body-tertiary" expand="lg">
            <Container>
                <Navbar.Brand href="/">Chat App</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link href="/">Home</Nav.Link>
                        {isAdmin && (
                            <Nav.Link href="/admin">Admin Panel</Nav.Link>
                        )}
                        <Nav.Brand onClick={handleLogout} style={{ cursor: "pointer" }}>
                            Logout
                        </Nav.Brand>
