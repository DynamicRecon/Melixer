import { useState, useCallback } from "react";
import axios from "axios";
import ISBNScanner from "./ISBNScanner";
import { createBook } from "../api/books";

const AddBook = () => {
    const [scanning, setScanning] = useState(false);
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        title: "", author: "", publisher: "",
        publication_year: "", isbn: "", genre: "",
        language: "English", pages: "", cover_image: "",
        read_status: "unread", format: "paperback",
        condition: "good", is_owned: true, is_favorite: false,
    });

    // Lookup book info from Open Library using ISBN
    const fetchBookInfo = useCallback(async (isbn) => {
        setScanning(false);
        setLoading(true);
        try {
            const { data } = await axios.get(
                `https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&format=json&jscmd=data`
            );
            const book = data[`ISBN:${isbn}`];
            if (book) {
                setForm((prev) => ({
                    ...prev,
                    isbn,
                    title: book.title || "",
                    author: book.authors?.[0]?.name || "",
                    publisher: book.publishers?.[0]?.name || "",
                    publication_year: book.publish_date?.slice(-4) || "",
                    pages: book.number_of_pages || "",
                    cover_image: book.cover?.large || "",
                }));
            } else {
                alert("Book not found. Please fill in manually.");
                setForm((prev) => ({ ...prev, isbn }));
            }
        } catch (err) {
            alert("Error looking up ISBN.");
        } finally {
            setLoading(false);
        }
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createBook(form);
            alert("Book added to Melixer!");
            setForm({
                title: "", author: "", publisher: "",
                publication_year: "", isbn: "", genre: "",
                language: "English", pages: "", cover_image: "",
                read_status: "unread", format: "paperback",
                condition: "good", is_owned: true, is_favorite: false,
            });
        } catch (err) {
            alert("Error saving book.");
        }
    };

    return (
        <div>
            <h2>Add a Book</h2>

            <button onClick={() => setScanning(!scanning)}>
                {scanning ? "Cancel Scan" : "📷 Scan ISBN Barcode"}
            </button>

            {scanning && <ISBNScanner onScanned={fetchBookInfo} />}
            {loading && <p>Looking up ISBN...</p>}

            <form onSubmit={handleSubmit}>
                <input name="title" placeholder="Title" value={form.title} onChange={handleChange} required />
                <input name="author" placeholder="Author" value={form.author} onChange={handleChange} required />
                <input name="publisher" placeholder="Publisher" value={form.publisher} onChange={handleChange} />
                <input name="publication_year" placeholder="Year" value={form.publication_year} onChange={handleChange} />
                <input name="isbn" placeholder="ISBN" value={form.isbn} onChange={handleChange} />
                <input name="genre" placeholder="Genre" value={form.genre} onChange={handleChange} />
                <input name="pages" placeholder="Pages" value={form.pages} onChange={handleChange} />
                <input name="cover_image" placeholder="Cover Image URL" value={form.cover_image} onChange={handleChange} />

                <select name="read_status" value={form.read_status} onChange={handleChange}>
                    <option value="unread">Unread</option>
                    <option value="reading">Currently Reading</option>
                    <option value="finished">Finished</option>
                </select>

                <select name="format" value={form.format} onChange={handleChange}>
                    <option value="hardcover">Hardcover</option>
                    <option value="paperback">Paperback</option>
                    <option value="ebook">eBook</option>
                    <option value="audiobook">Audiobook</option>
                </select>

                <select name="condition" value={form.condition} onChange={handleChange}>
                    <option value="new">New</option>
                    <option value="good">Good</option>
                    <option value="fair">Fair</option>
                    <option value="poor">Poor</option>
                </select>

                <label>
                    <input type="checkbox" name="is_owned" checked={form.is_owned} onChange={handleChange} />
                    Owned
                </label>

                <label>
                    <input type="checkbox" name="is_favorite" checked={form.is_favorite} onChange={handleChange} />
                    Favorite
                </label>

                <button type="submit">Add to Melixer</button>
            </form>
        </div>
    );
};

export default AddBook;