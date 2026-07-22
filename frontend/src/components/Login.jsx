import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";

const Login = () => {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data } = await API.post("/auth/login/", form);
      login({ username: data.username }, data.token);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.error || "Login Failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContext: "center",
        background: "#f5f7fa",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: "16px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          padding: "40px",
          width: "100%",
          maxWidth: "400px",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "8px" }}>📚 Melixer</h2>
        <p style={{ textAlign: "center", color: "#888", marginBottom: "28px" }}>
          Sign in to your library
        </p>
        {error && (
          <p
            style={{
              background: "#fff0f0",
              color: "#e74c3c",
              padding: "10px 14px",
              borderRadius: "8px",
              marginBottom: "16px",
              fontSize: "0.9rem",
            }}
          >
            {error}
          </p>
        )}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "16px" }}>
            <label style={labelStyle}>Username</label>
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              required
              style={inputStyle}
              placeholder="Enter your username"
            />
          </div>
          <div style={{ marginBottom: "24px" }}>
            <label style={labelStyle}>Password</label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
              style={inputStyle}
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "12px",
              background: "#4a90e2",
              color: "#fff",
              border: "none",
              borderRadius: "10px",
              fontSize: "1rem",
              fontWeight: "600",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {" "}
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
        <p
          style={{
            textAlign: "center",
            marginTop: "20px",
            fontSize: "0.9rem",
            color: "#888",
          }}
        >
          Don't have an account?{" "}
          <Link to="/register" style={{ color: "#4a90e2", fontWeight: "600" }}>
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

const labelStyle = {
  display: "block",
  marginBottom: "6px",
  fontSize: "0.88rem",
  fontWeight: "600",
  color: "#444",
};

const inputStyle = {
  width: "100%",
  padding: "10px 14px",
  borderRadius: "8px",
  border: "1px solid #ddd",
  fontSize: "0.95rem",
  boxSizing: "border-box",
};

export default Login;
