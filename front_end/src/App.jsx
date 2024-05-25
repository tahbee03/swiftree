import Home from "./pages/Home"; // <Home />
import Login from "./pages/Login"; // <Login />
import SignUp from "./pages/SignUp"; // <SignUp />
import Profile from "./pages/Profile"; // <Profile />
import Search from "./pages/Search"; // <Search />
import About from "./pages/About"; // <About />
import Help from "./pages/Help"; // <Help />
import NotFound from "./pages/NotFound"; // <NotFound />

import { BrowserRouter, Routes, Route } from "react-router-dom"; // <BrowserRouter>, <Routes>, <Route />

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/sign-up" element={<SignUp />} />
                <Route path="/profile/:username" element={<Profile />} />
                <Route path="/search" element={<Search />} />
                <Route path="/about" element={<About />} />
                <Route path="/help" element={<Help />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
}
