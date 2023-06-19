import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Profile from "./pages/Profile";
import Search from "./pages/Search";

function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <div className="pages">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/sign-up" element={<SignUp />} />
                        <Route path="/profile/:username" element={<Profile />} />
                        <Route path="/search" element={<Search />} />
                    </Routes>
                </div>
            </BrowserRouter>
        </div>
    );
}

export default App;
