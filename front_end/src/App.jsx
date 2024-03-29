import Home from "./pages/Home"; // <Home />
import Login from "./pages/Login"; // <Login />
import SignUp from "./pages/SignUp"; // <SignUp />
import Profile from "./pages/Profile"; // <Profile />
import Search from "./pages/Search"; // <Search />
import { BrowserRouter, Routes, Route } from "react-router-dom"; // <BrowserRouter>, <Routes>, <Route>

function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/sign-up" element={<SignUp />} />
                    <Route path="/profile/:username" element={<Profile />} />
                    <Route path="/search" element={<Search />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
