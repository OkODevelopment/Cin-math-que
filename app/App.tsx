import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "@/app/page";
import WishlistPage from "@/app/wishlist/page";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/wishlist" element={<WishlistPage />} />
            </Routes>
        </Router>
    );
}

export default App;
