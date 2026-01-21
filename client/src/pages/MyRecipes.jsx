import { useEffect, useState, useContext } from "react";
import API from "../services/api";
import RecipeCard from "../components/RecipeCard";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/Navbar";
export default function MyRecipes() {
  const { user } = useContext(AuthContext);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const loadMyRecipes = async () => {
    try {
      const res = await API.get("/recipes/my");
      setRecipes(res.data);
    } catch (err) {
      alert("Failed to load your recipes. Please login again.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadMyRecipes();
  }, []);
  const deleteRecipe = async (id) => {
    if (!window.confirm("Delete this recipe?")) return;
    try {
      await API.delete(`/recipes/${id}`);
      loadMyRecipes();
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    }
  };
  return (
    <>
      <Navbar />
      <div style={container}>
        <h2 style={title}>My Recipes</h2>
        {loading && <p>Loading...</p>}
        {!loading && recipes.length === 0 && (
          <p style={empty}>You haven’t added any recipes yet.</p>
        )}

        <div style={grid}>
          {recipes.map((r) => (
            <RecipeCard
              key={r._id}
              recipe={r}
              onEdit={() => alert("Edit from Home page")}
              onDelete={() => deleteRecipe(r._id)}
            />
          ))}
        </div>
      </div>
    </>
  );
}

const container = {
  maxWidth: "1200px",
  margin: "auto",
  padding: "20px",
};
const title = {
  textAlign: "center",
  marginBottom: "20px",
  color: "#ff914d",
};
const empty = {
  textAlign: "center",
  color: "#777",
};
const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
  gap: "20px",
};