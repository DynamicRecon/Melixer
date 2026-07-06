import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import API from '../api/axios'

const NavBar = () => {
    const location = useLocation(); // Tells you the current URL path
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const handleLogout = async () => {
        try {
            await API.post('/auth/logout/')
        } catch (err) {
            console.warn("Logout error: ", err)
        } finally {
            logout();
            navigate("/login");
        }
    }

    const linkStyle = (path) => ({
        textDecoration: "none",
        padding: "10px 20px",
        borderRadius: "8px",
        fontWeight: "600",
        fontSize: "0.95rem",
        // Highlight the active page
        background: location.pathname === path ? "#4a90e2" : "transparent",
        color: location.pathname === path ? "#fff" : "#555",
    });

    return (
        <nav style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "14px 24px",
            background: "#fff",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            marginBottom: "24px"
        }}>
            {/* App Name */}
            <Link to="/" style={{ textDecoration: "none", marginRight: "auto" }}>
                <h1 style={{ margin: 0, fontSize: "1.3rem", color: "#222" }}>📚 Melixer</h1>
            </Link>

            {/* Nav Links */}
            <Link to="/inventory" style={linkStyle("/inventory")}>My Library</Link>
            <Link to="/scan"      style={linkStyle("/scan")}>📷 Quick Scan</Link>
            <Link to="/add"       style={linkStyle("/add")}>+ Add Book</Link>

            {/* User info + logout */}
             <div style={{ marginLeft: "16px", display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontSize: "0.85rem", color: "#888" }}>
                    👤 {user?.username}
                </span>
                <button
                    onClick={handleLogout}
                    style={{
                        background: "#fff0f0", color: "#e74c3c",
                        border: "1px solid #f5c6cb", borderRadius: "8px",
                        padding: "8px 14px", cursor: "pointer",
                        fontSize: "0.85rem", fontWeight: "600"
                    }}
                >
                    Sign Out
                </button>
            </div>
        </nav>
    );
};

export default NavBar;