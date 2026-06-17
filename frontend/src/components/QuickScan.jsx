import { useState, useCallback } from "react";
import axios from "axios";
import ISBNScanner from "./ISBNScanner";
import { createBook } from "../api/books";

const QuickScan = () => {
    const [scanning, setScanning] = useState(false);
    const [status, setStatus] = useState(null); // 'loading' | 'saving' | 'success' | 'error' | 'notfound'
    const [lastBook, setLastBook] = useState(null);

    const handleScanned = useCallback(async (isbn) => {
    setScanning(false);
    setStatus("loading");

    try {
        // Step 1 — Fetch book data from new endpoint
        const { data } = await axios.get(
            `https://openlibrary.org/isbn/${isbn}.json`
        );

        if (!data) {
            setStatus("notfound");
            return;
        }

        // Step 2 — Author is a separate API call in the new endpoint
        let authorName = "";
        if (data.authors && data.authors.length > 0) {
            const authorKey = data.authors[0].key; // e.g. "/authors/OL23919A"
            const authorRes = await axios.get(
                `https://openlibrary.org${authorKey}.json`
            );
            authorName = authorRes.data.name || "";
        }

        // Step 3 — Cover image via covers API
        const coverId = data.covers?.[0];
        const coverUrl = coverId
            ? `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`
            : "";

        // Step 4 — Build book object
        const newBook = {
            title: data.title || "",
            author: authorName,
            publisher: data.publishers?.[0] || "",
            publication_year: data.publish_date?.slice(-4) || null,
            isbn: isbn,
            pages: data.number_of_pages || null,
            cover_image: coverUrl,
            language: "English",
            read_status: "unread",
            format: "paperback",
            condition: "good",
            is_owned: true,
            is_favorite: false,
        };

        setStatus("saving");

        // Step 5 — Auto submit to Django API
        await createBook(newBook);
        setLastBook(newBook);
        setStatus("success");

    } catch (err) {
        console.error(err);
        setStatus("error");
    }
}, []);

    const handleScanAnother = () => {
        setStatus(null);
        setLastBook(null);
        setScanning(true);
    };

    return (
        <div>
            <h2>Quick Scan</h2>
            <p>Scan a book's ISBN barcode to instantly add it to Melixer.</p>

            {/* Status Messages */}
            {status === "loading" && <p>🔍 Looking up ISBN...</p>}
            {status === "saving" && <p>💾 Saving to Melixer...</p>}
            {status === "notfound" && (
                <div>
                    <p>⚠️ Book not found in Open Library.</p>
                    <button onClick={handleScanAnother}>Try Another</button>
                </div>
            )}
            {status === "error" && (
                <div>
                    <p>❌ Something went wrong. Please try again.</p>
                    <button onClick={handleScanAnother}>Try Again</button>
                </div>
            )}
            {status === "success" && lastBook && (
                <div>
                    <p>✅ Added to Melixer!</p>
                    {lastBook.cover_image && (
                        <img
                            src={lastBook.cover_image}
                            alt={lastBook.title}
                            style={{ width: "100px" }}
                        />
                    )}
                    <p><strong>{lastBook.title}</strong></p>
                    <p>{lastBook.author}</p>
                    <button onClick={handleScanAnother}>Scan Another</button>
                </div>
            )}

            {/* Scanner */}
            {!status && (
                <>
                    {!scanning ? (
                        <button onClick={() => setScanning(true)}>
                            📷 Start Scanning
                        </button>
                    ) : (
                        <>
                            <button onClick={() => setScanning(false)}>
                                Cancel
                            </button>
                            <ISBNScanner onScanned={handleScanned} />
                        </>
                    )}
                </>
            )}
        </div>
    );
};

export default QuickScan;