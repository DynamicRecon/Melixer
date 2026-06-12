import { Link, useLocation } from "react-router-dom";

const NavBar = () => {
    const location = useLocation(); // Tells you the current URL path

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
        </nav>
    );
};

export default NavBar;