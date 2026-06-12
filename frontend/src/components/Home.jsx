import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getBooks } from "../api/books";

const Home = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        getBooks()
            .then(({ data }) => setBooks(data))
            .catch((err) => console.error("Failed to load books:", err))
            .finally(() => setLoading(false));
    }, []);

    // --- Stats Calculations ---
    const total         = books.length;
    const unread        = books.filter((b) => b.read_status === "unread").length;
    const reading       = books.filter((b) => b.read_status === "reading").length;
    const finished      = books.filter((b) => b.read_status === "finished").length;
    const favorites     = books.filter((b) => b.is_favorite).length;
    const loanedOut     = books.filter((b) => b.loaned_to).length;
    const avgRating     = books.filter((b) => b.rating)
                               .reduce((acc, b, _, arr) => acc + b.rating / arr.length, 0)
                               .toFixed(1);

    // --- Derived Lists ---
    const currentlyReading  = books.filter((b) => b.read_status === "reading").slice(0, 4);
    const recentlyAdded     = [...books].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 4);
    const favoriteBooks     = books.filter((b) => b.is_favorite).slice(0, 4);

    const renderStars = (rating) => {
        if (!rating) return null;
        return [...Array(5)].map((_, i) => (
            <span key={i} style={{ color: i < rating ? "#f5a623" : "#ddd", fontSize: "0.9rem" }}>★</span>
        ));
    };

    const statusBadgeStyle = (status) => {
        const colors = {
            unread:   { background: "#e0e0e0", color: "#555" },
            reading:  { background: "#fff3cd", color: "#856404" },
            finished: { background: "#d4edda", color: "#155724" },
        };
        return {
            ...colors[status],
            padding: "2px 10px",
            borderRadius: "12px",
            fontSize: "0.72rem",
            fontWeight: "bold",
            textTransform: "capitalize",
        };
    };

    // --- Reusable Mini Book Card ---
    const MiniBookCard = ({ book }) => (
        <div
            onClick={() => navigate(`/books/${book.id}`)}
            style={{
                display: "flex", gap: "12px", alignItems: "center",
                padding: "10px", borderRadius: "10px",
                background: "#f9f9f9", cursor: "pointer",
                transition: "background 0.15s",
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = "#f0f4ff"}
            onMouseLeave={(e) => e.currentTarget.style.background = "#f9f9f9"}
        >
            {/* Mini Cover */}
            <div style={{
                width: "44px", height: "60px", borderRadius: "4px",
                background: "#e0e0e0", overflow: "hidden",
                display: "flex", alignItems: "center",
                justifyContent: "center", flexShrink: 0
            }}>
                {book.cover_image
                    ? <img src={book.cover_image} alt={book.title}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    : <span style={{ fontSize: "1.4rem" }}>📚</span>
                }
            </div>

            {/* Info */}
            <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{
                    margin: "0 0 2px", fontWeight: "600", fontSize: "0.88rem",
                    color: "#222", whiteSpace: "nowrap",
                    overflow: "hidden", textOverflow: "ellipsis"
                }}>
                    {book.title}
                </p>
                <p style={{ margin: "0 0 4px", fontSize: "0.78rem", color: "#777" }}>
                    {book.author}
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <span style={statusBadgeStyle(book.read_status)}>
                        {book.read_status === "reading" ? "Reading" : book.read_status}
                    </span>
                    {book.rating && (
                        <span style={{ fontSize: "0.78rem" }}>{renderStars(book.rating)}</span>
                    )}
                </div>
            </div>
        </div>
    );

    // --- Stat Card ---
    const StatCard = ({ emoji, label, value, color, onClick }) => (
        <div
            onClick={onClick}
            style={{
                background: "#fff", borderRadius: "14px",
                boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
                padding: "20px", textAlign: "center",
                cursor: onClick ? "pointer" : "default",
                transition: "transform 0.15s, box-shadow 0.15s",
                borderTop: `4px solid ${color}`
            }}
            onMouseEnter={(e) => {
                if (onClick) {
                    e.currentTarget.style.transform = "translateY(-3px)";
                    e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.1)";
                }
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.07)";
            }}
        >
            <p style={{ margin: "0 0 6px", fontSize: "1.8rem" }}>{emoji}</p>
            <p style={{ margin: "0 0 4px", fontSize: "2rem", fontWeight: "800", color }}>{value}</p>
            <p style={{ margin: 0, fontSize: "0.8rem", color: "#888", fontWeight: "500" }}>{label}</p>
        </div>
    );

    // --- Section Header ---
    const SectionHeader = ({ title, linkLabel, onLink }) => (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
            <h3 style={{ margin: 0, fontSize: "1rem", color: "#333" }}>{title}</h3>
            {onLink && (
                <button onClick={onLink} style={{
                    background: "none", border: "none",
                    color: "#4a90e2", cursor: "pointer",
                    fontSize: "0.85rem", fontWeight: "600", padding: 0
                }}>
                    {linkLabel} →
                </button>
            )}
        </div>
    );

    if (loading) return <p style={{ textAlign: "center", marginTop: "80px" }}>Loading your library...</p>;

    return (
        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "24px" }}>

            {/* Welcome Header */}
            <div style={{ marginBottom: "28px" }}>
                <h1 style={{ margin: "0 0 6px", fontSize: "1.8rem", color: "#222" }}>
                    📚 Welcome to Melixer
                </h1>
                <p style={{ margin: 0, color: "#888", fontSize: "0.95rem" }}>
                    Your personal library at a glance
                </p>
            </div>

            {/* Stats Grid */}
            <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
                gap: "16px",
                marginBottom: "36px"
            }}>
                <StatCard emoji="📚" label="Total Books"       value={total}    color="#4a90e2" onClick={() => navigate("/inventory")} />
                <StatCard emoji="📖" label="Reading"           value={reading}  color="#f5a623" onClick={() => navigate("/inventory")} />
                <StatCard emoji="✅" label="Finished"          value={finished} color="#27ae60" onClick={() => navigate("/inventory")} />
                <StatCard emoji="🔖" label="Unread"            value={unread}   color="#9b59b6" onClick={() => navigate("/inventory")} />
                <StatCard emoji="★"  label="Favorites"         value={favorites} color="#e74c3c" onClick={() => navigate("/inventory")} />
                <StatCard emoji="📤" label="Loaned Out"        value={loanedOut} color="#e67e22" />
                <StatCard emoji="⭐" label="Avg Rating"        value={avgRating > 0 ? `${avgRating}/5` : "N/A"} color="#f39c12" />
            </div>

            {/* Quick Actions */}
            <div style={{
                display: "flex", gap: "12px",
                marginBottom: "36px", flexWrap: "wrap"
            }}>
                <button onClick={() => navigate("/scan")} style={{
                    background: "#4a90e2", color: "#fff",
                    border: "none", borderRadius: "10px",
                    padding: "12px 22px", cursor: "pointer",
                    fontSize: "0.95rem", fontWeight: "600"
                }}>
                    📷 Quick Scan
                </button>
                <button onClick={() => navigate("/add")} style={{
                    background: "#fff", color: "#4a90e2",
                    border: "2px solid #4a90e2", borderRadius: "10px",
                    padding: "12px 22px", cursor: "pointer",
                    fontSize: "0.95rem", fontWeight: "600"
                }}>
                    + Add Book Manually
                </button>
                <button onClick={() => navigate("/inventory")} style={{
                    background: "#fff", color: "#555",
                    border: "2px solid #ddd", borderRadius: "10px",
                    padding: "12px 22px", cursor: "pointer",
                    fontSize: "0.95rem", fontWeight: "600"
                }}>
                    📋 View Full Library
                </button>
            </div>

            {/* Three Column Sections */}
            <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: "24px"
            }}>

                {/* Currently Reading */}
                <div style={{
                    background: "#fff", borderRadius: "14px",
                    boxShadow: "0 2px 12px rgba(0,0,0,0.07)", padding: "20px"
                }}>
                    <SectionHeader
                        title="📖 Currently Reading"
                        linkLabel="View All"
                        onLink={() => navigate("/inventory")}
                    />
                    {currentlyReading.length === 0
                        ? <p style={{ color: "#bbb", fontSize: "0.85rem" }}>No books in progress.</p>
                        : <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                            {currentlyReading.map((b) => <MiniBookCard key={b.id} book={b} />)}
                          </div>
                    }
                </div>

                {/* Recently Added */}
                <div style={{
                    background: "#fff", borderRadius: "14px",
                    boxShadow: "0 2px 12px rgba(0,0,0,0.07)", padding: "20px"
                }}>
                    <SectionHeader
                        title="🆕 Recently Added"
                        linkLabel="View All"
                        onLink={() => navigate("/inventory")}
                    />
                    {recentlyAdded.length === 0
                        ? <p style={{ color: "#bbb", fontSize: "0.85rem" }}>No books added yet.</p>
                        : <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                            {recentlyAdded.map((b) => <MiniBookCard key={b.id} book={b} />)}
                          </div>
                    }
                </div>

                {/* Favorites */}
                <div style={{
                    background: "#fff", borderRadius: "14px",
                    boxShadow: "0 2px 12px rgba(0,0,0,0.07)", padding: "20px"
                }}>
                    <SectionHeader
                        title="★ Favorites"
                        linkLabel="View All"
                        onLink={() => navigate("/inventory")}
                    />
                    {favoriteBooks.length === 0
                        ? <p style={{ color: "#bbb", fontSize: "0.85rem" }}>No favorites marked yet.</p>
                        : <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                            {favoriteBooks.map((b) => <MiniBookCard key={b.id} book={b} />)}
                          </div>
                    }
                </div>

            </div>
        </div>
    );
};

export default Home;