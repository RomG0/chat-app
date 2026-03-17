import { useEffect } from "react";
import { useNavigate } from "react-router";

const HomePage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    // Verify the token is still accepted by the backend
    fetch("http://localhost:5000/api/chat/messages", {
      headers: { Authorization: `Bearer ${token}` },
    }).then((res) => {
      if (res.status === 401 || res.status === 403) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    });
  }, [navigate]);

  return <div>Home</div>;
};

export default HomePage;
