import { useEffect, useState } from "react";
import API from "../services/api";
import RecipeCard from "../components/RecipeCard";
import Navbar from "../components/Navbar";
export default function Favorites() {
  const [recipes, setRecipes] = useState([]);
  useEffect(() => {
    API.get("/recipes/favorites")
      .then((res) => setRecipes(res.data))
      .catch(() => alert("Failed to load favorites"));
  }, []);
  return (
    <>
      <Navbar />
      <div style={container}>
        <h2>My Favorite Recipes</h2>
        <div style={grid}>
          {recipes.length === 0 && <p>No favorites yet</p>}
          {recipes.map((r) => (
            <RecipeCard key={r._id} recipe={r} />
          ))}
        </div>
      </div>
    </>
  );
}
const container = {
  padding: "20px",
};
const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(250px,1fr))",
  gap: "20px",
};