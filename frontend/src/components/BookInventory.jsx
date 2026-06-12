import { useState, useEffect } from "react";
import { getBooks, deleteBook, createBook } from "../api/books";
import { useNavigate } from "react-router-dom";

const BookInventory = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState("");
    const [form, setForm] = useState({
        title: "", author: "", publisher: "",
        publication_year: "", isbn: "", genre: "",
        language: "English", pages: "", cover_image: "",
        read_status: "unread", format: "paperback",
        condition: "good", is_owned: true, is_favorite: false,
    });
    const [filterStatus, setFilterStatus] = useState("all");
    const [sortBy, setSortBy] = useState("title");
    const navigate = useNavigate();
    

     // On each book card, add onClick:
    // onClick={() => navigate(`/books/${book.id}`)}

    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = async () => {
        try {
            setLoading(true);
            const { data } = await getBooks();
            setBooks(data);
        } catch (err) {
            setError("Failed to load books.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Remove this book from Melixer?")) return;
        try {
            await deleteBook(id);
            setBooks((prev) => prev.filter((b) => b.id !== id));
        } catch (err) {
            alert("Failed to delete book.");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await createBook(form);
        navigate("/inventory"); // Redirect to inventory after saving
    };

    // Filter & Search & Sort
    const filteredBooks = books
        .filter((b) => {
            const matchesSearch =
                b.title.toLowerCase().includes(search.toLowerCase()) ||
                b.author.toLowerCase().includes(search.toLowerCase()) ||
                (b.genre && b.genre.toLowerCase().includes(search.toLowerCase()));
            const matchesStatus =
                filterStatus === "all" || b.read_status === filterStatus;
            return matchesSearch && matchesStatus;
        })
        .sort((a, b) => {
            if (sortBy === "title") return a.title.localeCompare(b.title);
            if (sortBy === "author") return a.author.localeCompare(b.author);
            if (sortBy === "rating") return (b.rating || 0) - (a.rating || 0);
            if (sortBy === "year") return (b.publication_year || 0) - (a.publication_year || 0);
            return 0;
        });

    const statusBadgeStyle = (status) => {
        const colors = {
            unread: { background: "#e0e0e0", color: "#555" },
            reading: { background: "#fff3cd", color: "#856404" },
            finished: { background: "#d4edda", color: "#155724" },
        };
        return {
            ...colors[status],
            padding: "3px 10px",
            borderRadius: "12px",
            fontSize: "0.75rem",
            fontWeight: "bold",
            textTransform: "capitalize",
        };
    };

    const renderStars = (rating) => {
        if (!rating) return <span style={{ color: "#ccc" }}>No rating</span>;
        return [...Array(5)].map((_, i) => (
            <span key={i} style={{ color: i < rating ? "#f5a623" : "#ddd", fontSize: "1rem" }}>
                ★
            </span>
        ));
    };

    if (loading) return <p style={{ textAlign: "center" }}>Loading your library...</p>;
    if (error) return <p style={{ textAlign: "center", color: "red" }}>{error}</p>;

    return (
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>

            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <h2 style={{ margin: 0 }}>📚 My Library</h2>
                <span style={{ color: "#888" }}>{filteredBooks.length} book{filteredBooks.length !== 1 ? "s" : ""}</span>
            </div>

            {/* Controls */}
            <div style={{ display: "flex", gap: "12px", marginBottom: "24px", flexWrap: "wrap" }}>
                <input
                    type="text"
                    placeholder="🔍 Search title, author, genre..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{
                        flex: 1, minWidth: "200px", padding: "10px 14px",
                        borderRadius: "8px", border: "1px solid #ddd", fontSize: "0.95rem"
                    }}
                />
                <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    style={{ padding: "10px 14px", borderRadius: "8px", border: "1px solid #ddd" }}
                >
                    <option value="all">All Statuses</option>
                    <option value="unread">Unread</option>
                    <option value="reading">Currently Reading</option>
                    <option value="finished">Finished</option>
                </select>
                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    style={{ padding: "10px 14px", borderRadius: "8px", border: "1px solid #ddd" }}
                >
                    <option value="title">Sort: Title</option>
                    <option value="author">Sort: Author</option>
                    <option value="rating">Sort: Rating</option>
                    <option value="year">Sort: Year</option>
                </select>
            </div>

            {/* Empty State */}
            {filteredBooks.length === 0 && (
                <div style={{ textAlign: "center", padding: "60px 0", color: "#aaa" }}>
                    <p style={{ fontSize: "3rem" }}>📖</p>
                    <p>No books found. Try adjusting your search or scan a new book!</p>
                </div>
            )}

            {/* Book Grid */}
            <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                gap: "24px"
            }}>
                {filteredBooks.map((book) => (
                    <div key={book.id} style={{
                        background: "#fff",
                        borderRadius: "12px",
                        boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                        overflow: "hidden",
                        display: "flex",
                        flexDirection: "column",
                        transition: "transform 0.2s, box-shadow 0.2s",
                        cursor: "pointer",
                    }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "translateY(-4px)";
                            e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.12)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.08)";
                        }}
                    >
                        {/* Book Cover */}
                        <div style={{
                            width: "100%", height: "240px",
                            background: "#f0f0f0",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            overflow: "hidden"
                        }}>
                            {book.cover_image ? (
                                <img
                                    src={book.cover_image}
                                    alt={book.title}
                                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                />
                            ) : (
                                <span style={{ fontSize: "4rem" }}>📚</span>
                            )}
                        </div>

                        {/* Book Info */}
                        <div style={{ padding: "14px", flexGrow: 1, display: "flex", flexDirection: "column", gap: "6px" }}>

                            {/* Favorite */}
                            {book.is_favorite && (
                                <span style={{ color: "#f5a623", fontSize: "0.85rem" }}>★ Favorite</span>
                            )}

                            {/* Title */}
                            <h3 style={{
                                margin: 0, fontSize: "0.95rem", fontWeight: "700",
                                lineHeight: "1.3", color: "#222",
                                display: "-webkit-box", WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical", overflow: "hidden"
                            }}>
                                {book.title}
                            </h3>

                            {/* Author */}
                            <p style={{ margin: 0, fontSize: "0.85rem", color: "#666" }}>
                                {book.author}
                            </p>

                            {/* Genre & Year */}
                            <p style={{ margin: 0, fontSize: "0.8rem", color: "#999" }}>
                                {[book.genre, book.publication_year].filter(Boolean).join(" · ")}
                            </p>

                            {/* Rating */}
                            <div style={{ fontSize: "0.85rem" }}>
                                {renderStars(book.rating)}
                            </div>

                            {/* Format & Pages */}
                            <p style={{ margin: 0, fontSize: "0.8rem", color: "#999", textTransform: "capitalize" }}>
                                {[book.format, book.pages ? `${book.pages} pages` : null].filter(Boolean).join(" · ")}
                            </p>

                            {/* Series */}
                            {book.series_name && (
                                <p style={{ margin: 0, fontSize: "0.8rem", color: "#888", fontStyle: "italic" }}>
                                    {book.series_name}{book.series_volume ? ` #${book.series_volume}` : ""}
                                </p>
                            )}

                            {/* Loaned Out */}
                            {book.loaned_to && (
                                <p style={{ margin: 0, fontSize: "0.8rem", color: "#e67e22" }}>
                                    📤 Loaned to {book.loaned_to}
                                </p>
                            )}

                            {/* Status Badge */}
                            <div style={{ marginTop: "auto", paddingTop: "8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <span style={statusBadgeStyle(book.read_status)}>
                                    {book.read_status === "reading" ? "Reading" : book.read_status}
                                </span>

                                {/* Delete Button */}
                                <button
                                    onClick={() => handleDelete(book.id)}
                                    style={{
                                        background: "none", border: "none",
                                        cursor: "pointer", color: "#ccc",
                                        fontSize: "1rem", padding: "4px"
                                    }}
                                    title="Remove book"
                                >
                                    🗑️
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BookInventory;