import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./Home";
import Search from "./Search";

function App() {
  return (
    <Router>
      <div>
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
          <div className="container-fluid">
            <Link to="/" className="navbar-brand ms-4 nav-link">
              User Behavior Data
            </Link>
            <div className="navbar-nav"> {/* Group links together */}
              <Link to="/search" className="nav-link text-white">
                Search Through Dataset
              </Link>
            </div>
          </div>
        </nav>
        <hr />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

