import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Messages
from "./pages/Messages";  

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route path="/home" element={<Home />} />

        <Route
  path="/messages"
  element={
    <Messages />
  }
/>

        <Route
          path="/profile/:id"
          element={<Profile />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;