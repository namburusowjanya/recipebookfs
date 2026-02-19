import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  return (
    <nav style={nav}>
      <span style={brand}>
        🍳 My Recipe Book
      </span>
      <div style={right}>
        {!user && (
          <>
            <Link to="/login" style={link}>Login</Link>
            <Link to="/register" style={link}>Register</Link>
          </>
        )}

        {user && (
          <>
            <span style={username}>
              {user.username}
              {user.role === "admin" && " 👑"}
            </span>
            <Link to="/" style={link}>
              Home
            </Link>
            <Link to="/my-recipes" style={link}>
              My Recipes
            </Link>
            <Link to="/favorites" style={link}>
              My Favorites
            </Link>
            {user.role === "admin" && (
              <Link to="/admin" style={link}>
                Admin
              </Link>
            )}

            <button style={logoutBtn} onClick={logout}>
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
const nav = {
  background: "#ff914d",
  padding: "12px 24px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  color: "white",
};

const brand = {
  fontSize: "1.2rem",
  fontWeight: "bold",
};

const right = {
  display: "flex",
  alignItems: "center",
  gap: "15px",
};

const link = {
  color: "white",
  marginLeft: "15px",
  textDecoration: "none",
  fontWeight: "bold",
  cursor: "pointer",
  display: "inline-block"
};

const username = {
  fontWeight: "bold",
  marginRight: "5px",
};

const logoutBtn = {
  background: "white",
  color: "#ff914d",
  border: "none",
  padding: "6px 14px",
  borderRadius: "20px",
  cursor: "pointer",
  fontWeight: "bold",
};