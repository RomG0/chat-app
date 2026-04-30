import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router";
import { useSocket } from "../contexts/SocketContext";

const LoginPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  console.log(useSocket());
  const { setToken } = useSocket();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Invalid username or password.");
        return;
      }

      localStorage.setItem("token", data.token);
      setToken(data.token);
      navigate("/");
    } catch {
      setError("Could not reach the server");
    } finally {
      setLoading(false);
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
                <strong>Login</strong>
              </h5>

              {error && <p style={{ color: "red" }}>{error}</p>}

              <form
                onSubmit={handleSubmit}
                className="LoginForm flex flex-col gap-3"
              >
                <div>
                  <label>Username</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    disabled={loading}
                    className="form-control"
                  />
                </div>
                <div className="mt-3">
                  <label>Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                    className="form-control"
                  />
                </div>
                <button
                  className="btn btn-primary mt-3"
                  type="submit"
                  disabled={loading || !username || !password}
                >
                  {loading ? "Logging in..." : "Login"}
                </button>
              </form>

              <p className="mt-3">
                Don't have an account? <Link to="/register">Register</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
