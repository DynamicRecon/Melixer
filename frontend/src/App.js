import { Routes, Route } from "react-router-dom";
import Navbar from "./components/NavBar";
import Home from "./components/Home";
import BookInventory from "./components/BookInventory";
import BookDetail from "./components/BookDetail";
import AddBook from "./components/AddBook";
import QuickScan from "./components/QuickScan";

function App() {
    return (
        <div>
            <Navbar />
            <Routes>
                <Route path="/"             element={<Home />} />
                <Route path="/inventory"    element={<BookInventory />} />
                <Route path="/books/:id"    element={<BookDetail />} />  {/* ← Add this */}
                <Route path="/add"          element={<AddBook />} />
                <Route path="/scan"         element={<QuickScan />} />
                <Route path="*"             element={<h2 style={{ textAlign: "center" }}>404 - Page Not Found</h2>} />
            </Routes>
        </div>
    );
}

export default App;