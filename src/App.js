import { useState, useEffect } from "react";
import "./App.css";
import { db } from "./firebase";
import { collection, doc, getDocs } from "firebase/firestore";
import Login from "./components/Login/Login";
import Profile from "./components/Profile/Profile";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route exact path="/" element={<Login />}></Route>
          <Route path="/profile" element={<Profile />}></Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
