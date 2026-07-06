import { Routes, Route } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Navbar from "./components/NavBar";
import Home from "./components/Home";
import BookInventory from "./components/BookInventory";
import BookDetail from "./components/BookDetail";
import AddBook from "./components/AddBook";
import QuickScan from "./components/QuickScan";
import Login from "./components/Login";
import Register from "./components/Register";
import ProtectedRoute from "./components/ProtectedRoute";

console.log("API URL:", process.env.REACT_APP_API_URL);

function App() {
    const { token } = useAuth();

    return (
        <div>
            {/* Only show Navbar when logged in */}
            {token && <Navbar />}

            <Routes>
                {/* Public routes */}
                <Route path="/login"    element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Protected routes */}
                <Route path="/" element={
                    <ProtectedRoute><Home /></ProtectedRoute>
                } />
                <Route path="/inventory" element={
                    <ProtectedRoute><BookInventory /></ProtectedRoute>
                } />
                <Route path="/books/:id" element={
                    <ProtectedRoute><BookDetail /></ProtectedRoute>
                } />
                <Route path="/add" element={
                    <ProtectedRoute><AddBook /></ProtectedRoute>
                } />
                <Route path="/scan" element={
                    <ProtectedRoute><QuickScan /></ProtectedRoute>
                } />

                <Route path="*" element={
                    <h2 style={{ textAlign: "center" }}>404 - Page Not Found</h2>
                } />
            </Routes>
        </div>
    );
}

export default App;