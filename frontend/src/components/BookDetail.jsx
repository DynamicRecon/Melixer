import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getBook, updateBook, deleteBook } from "../api/books";

const BookDetail = () => {
    const { id } = useParams();       // Grabs the :id from the URL
    const navigate = useNavigate();

    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({});

    useEffect(() => {
        fetchBook();
    }, [id]);

    const fetchBook = async () => {
        try {
            setLoading(true);
            const { data } = await getBook(id);
            setBook(data);
            setForm(data); // Pre-fill edit form with current data
        } catch (err) {
            console.error("Failed to load book:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            const { data } = await updateBook(id, form);
            setBook(data);
            setEditing(false);
        } catch (err) {
            alert("Failed to save changes.");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("Remove this book from Melixer?")) return;
        try {
            await deleteBook(id);
            navigate("/inventory");
        } catch (err) {
            alert("Failed to delete book.");
        }
    };

    const renderStars = (rating) => {
        if (!rating) return <span style={{ color: "#ccc" }}>No rating</span>;
        return [...Array(5)].map((_, i) => (
            <span key={i} style={{ color: i < rating ? "#f5a623" : "#ddd", fontSize: "1.4rem" }}>
                ★
            </span>
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
            padding: "5px 14px",
            borderRadius: "12px",
            fontSize: "0.85rem",
            fontWeight: "bold",
            textTransform: "capitalize",
            display: "inline-block",
        };
    };

    if (loading) return <p style={{ textAlign: "center", marginTop: "60px" }}>Loading book...</p>;
    if (!book)   return <p style={{ textAlign: "center", marginTop: "60px" }}>Book not found.</p>;

    return (
        <div style={{ maxWidth: "800px", margin: "0 auto", padding: "24px" }}>

            {/* Back Button */}
            <button
                onClick={() => navigate("/inventory")}
                style={{
                    background: "none", border: "none",
                    cursor: "pointer", color: "#4a90e2",
                    fontSize: "0.95rem", marginBottom: "20px",
                    padding: 0
                }}
            >
                ← Back to Library
            </button>

            {/* Main Card */}
            <div style={{
                background: "#fff",
                borderRadius: "16px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                overflow: "hidden"
            }}>
                {/* Top Section — Cover + Core Info */}
                <div style={{
                    display: "flex",
                    gap: "24px",
                    padding: "24px",
                    flexWrap: "wrap"
                }}>
                    {/* Cover Image */}
                    <div style={{
                        width: "160px", minWidth: "160px",
                        height: "230px", background: "#f5f5f5",
                        borderRadius: "8px", overflow: "hidden",
                        display: "flex", alignItems: "center",
                        justifyContent: "center", flexShrink: 0
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

                    {/* Core Info */}
                    <div style={{ flex: 1, minWidth: "200px" }}>

                        {book.is_favorite && (
                            <p style={{ margin: "0 0 6px", color: "#f5a623", fontSize: "0.9rem" }}>
                                ★ Favorite
                            </p>
                        )}

                        <h2 style={{ margin: "0 0 6px", fontSize: "1.5rem", color: "#222" }}>
                            {book.title}
                        </h2>

                        <p style={{ margin: "0 0 4px", fontSize: "1rem", color: "#555" }}>
                            by {book.author}
                        </p>

                        {book.series_name && (
                            <p style={{ margin: "0 0 12px", fontSize: "0.85rem", color: "#888", fontStyle: "italic" }}>
                                {book.series_name}{book.series_volume ? ` #${book.series_volume}` : ""}
                            </p>
                        )}

                        <div style={{ marginBottom: "12px" }}>
                            {renderStars(book.rating)}
                        </div>

                        <div style={{ marginBottom: "12px" }}>
                            <span style={statusBadgeStyle(book.read_status)}>
                                {book.read_status === "reading" ? "Currently Reading" : book.read_status}
                            </span>
                        </div>

                        {/* Meta Grid */}
                        <div style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            gap: "8px",
                            fontSize: "0.85rem",
                            color: "#666"
                        }}>
                            {book.publisher && <p style={{ margin: 0 }}>🏢 {book.publisher}</p>}
                            {book.publication_year && <p style={{ margin: 0 }}>📅 {book.publication_year}</p>}
                            {book.genre && <p style={{ margin: 0 }}>🏷️ {book.genre}</p>}
                            {book.pages && <p style={{ margin: 0 }}>📄 {book.pages} pages</p>}
                            {book.language && <p style={{ margin: 0 }}>🌐 {book.language}</p>}
                            {book.isbn && <p style={{ margin: 0 }}>🔢 ISBN: {book.isbn}</p>}
                            {book.format && <p style={{ margin: 0, textTransform: "capitalize" }}>📖 {book.format}</p>}
                            {book.condition && <p style={{ margin: 0, textTransform: "capitalize" }}>🔍 {book.condition} condition</p>}
                            {book.shelf_location && <p style={{ margin: 0 }}>📍 {book.shelf_location}</p>}
                            {book.loaned_to && <p style={{ margin: 0, color: "#e67e22" }}>📤 Loaned to {book.loaned_to}</p>}
                        </div>

                        {/* Dates */}
                        {(book.date_started || book.date_finished) && (
                            <div style={{ marginTop: "10px", fontSize: "0.85rem", color: "#888" }}>
                                {book.date_started  && <p style={{ margin: 0 }}>Started: {book.date_started}</p>}
                                {book.date_finished && <p style={{ margin: 0 }}>Finished: {book.date_finished}</p>}
                            </div>
                        )}
                    </div>
                </div>

                {/* Notes Section */}
                {book.notes && (
                    <div style={{
                        padding: "0 24px 24px",
                        borderTop: "1px solid #f0f0f0",
                        paddingTop: "20px"
                    }}>
                        <h4 style={{ margin: "0 0 8px", color: "#444" }}>📝 Notes</h4>
                        <p style={{ margin: 0, color: "#666", lineHeight: "1.6" }}>{book.notes}</p>
                    </div>
                )}

                {/* Edit Form */}
                {editing && (
                    <div style={{
                        padding: "24px",
                        borderTop: "1px solid #f0f0f0",
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "12px"
                    }}>
                        <h3 style={{ gridColumn: "1 / -1", margin: "0 0 8px" }}>Edit Book</h3>

                        <input name="title" placeholder="Title" value={form.title || ""} onChange={handleChange}
                            style={inputStyle} />
                        <input name="author" placeholder="Author" value={form.author || ""} onChange={handleChange}
                            style={inputStyle} />
                        <input name="publisher" placeholder="Publisher" value={form.publisher || ""} onChange={handleChange}
                            style={inputStyle} />
                        <input name="publication_year" placeholder="Year" value={form.publication_year || ""} onChange={handleChange}
                            style={inputStyle} />
                        <input name="genre" placeholder="Genre" value={form.genre || ""} onChange={handleChange}
                            style={inputStyle} />
                        <input name="pages" placeholder="Pages" value={form.pages || ""} onChange={handleChange}
                            style={inputStyle} />
                        <input name="shelf_location" placeholder="Shelf Location" value={form.shelf_location || ""} onChange={handleChange}
                            style={inputStyle} />
                        <input name="loaned_to" placeholder="Loaned To" value={form.loaned_to || ""} onChange={handleChange}
                            style={inputStyle} />
                        <input name="rating" type="number" min="1" max="5" placeholder="Rating (1-5)"
                            value={form.rating || ""} onChange={handleChange} style={inputStyle} />
                        <input name="cover_image" placeholder="Cover Image URL" value={form.cover_image || ""} onChange={handleChange}
                            style={inputStyle} />

                        <select name="read_status" value={form.read_status || "unread"} onChange={handleChange} style={inputStyle}>
                            <option value="unread">Unread</option>
                            <option value="reading">Currently Reading</option>
                            <option value="finished">Finished</option>
                        </select>

                        <select name="format" value={form.format || "paperback"} onChange={handleChange} style={inputStyle}>
                            <option value="hardcover">Hardcover</option>
                            <option value="paperback">Paperback</option>
                            <option value="ebook">eBook</option>
                            <option value="audiobook">Audiobook</option>
                        </select>

                        <select name="condition" value={form.condition || "good"} onChange={handleChange} style={inputStyle}>
                            <option value="new">New</option>
                            <option value="good">Good</option>
                            <option value="fair">Fair</option>
                            <option value="poor">Poor</option>
                        </select>

                        <input name="date_started" type="date" value={form.date_started || ""} onChange={handleChange}
                            style={inputStyle} />
                        <input name="date_finished" type="date" value={form.date_finished || ""} onChange={handleChange}
                            style={inputStyle} />

                        <textarea name="notes" placeholder="Notes / Review" value={form.notes || ""} onChange={handleChange}
                            style={{ ...inputStyle, gridColumn: "1 / -1", minHeight: "100px", resize: "vertical" }} />

                        <div style={{ gridColumn: "1 / -1", display: "flex", gap: "8px" }}>
                            <label style={{ fontSize: "0.9rem", display: "flex", alignItems: "center", gap: "6px" }}>
                                <input type="checkbox" name="is_favorite" checked={form.is_favorite || false} onChange={handleChange} />
                                Favorite
                            </label>
                            <label style={{ fontSize: "0.9rem", display: "flex", alignItems: "center", gap: "6px" }}>
                                <input type="checkbox" name="is_owned" checked={form.is_owned || false} onChange={handleChange} />
                                Owned
                            </label>
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div style={{
                    padding: "16px 24px",
                    borderTop: "1px solid #f0f0f0",
                    display: "flex",
                    gap: "10px",
                    justifyContent: "flex-end"
                }}>
                    {editing ? (
                        <>
                            <button onClick={() => setEditing(false)} style={secondaryBtnStyle}>
                                Cancel
                            </button>
                            <button onClick={handleSave} disabled={saving} style={primaryBtnStyle}>
                                {saving ? "Saving..." : "💾 Save Changes"}
                            </button>
                        </>
                    ) : (
                        <>
                            <button onClick={handleDelete} style={deleteBtnStyle}>
                                🗑️ Remove
                            </button>
                            <button onClick={() => setEditing(true)} style={primaryBtnStyle}>
                                ✏️ Edit
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

// Reusable styles
const inputStyle = {
    padding: "10px 12px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    fontSize: "0.9rem",
    width: "100%",
    boxSizing: "border-box"
};

const primaryBtnStyle = {
    background: "#4a90e2", color: "#fff",
    border: "none", borderRadius: "8px",
    padding: "10px 20px", cursor: "pointer",
    fontSize: "0.9rem", fontWeight: "600"
};

const secondaryBtnStyle = {
    background: "#f0f0f0", color: "#555",
    border: "none", borderRadius: "8px",
    padding: "10px 20px", cursor: "pointer",
    fontSize: "0.9rem", fontWeight: "600"
};

const deleteBtnStyle = {
    background: "#fff0f0", color: "#e74c3c",
    border: "1px solid #f5c6cb", borderRadius: "8px",
    padding: "10px 20px", cursor: "pointer",
    fontSize: "0.9rem", fontWeight: "600"
};

export default BookDetail;