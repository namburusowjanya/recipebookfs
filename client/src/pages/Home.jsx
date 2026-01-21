import { useEffect, useState, useContext } from "react";
import API from "../services/api";
import RecipeCard from "../components/RecipeCard";
import RecipeModal from "../components/RecipeModal";
import AddRecipe from "../components/AddRecipe";
import EditRecipe from "../components/EditRecipe";
import Navbar from "../components/Navbar";
import { AuthContext } from "../context/AuthContext";

export default function Home() {
  const [recipes, setRecipes] = useState([]);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [editRecipe, setEditRecipe] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const { user } = useContext(AuthContext);
  const loadRecipes = async () => {
    const res = await API.get("/recipes");
    setRecipes(res.data);
  };
  useEffect(() => {
    loadRecipes();
  }, []);
  const deleteRecipe = async (id) => {
    if (!window.confirm("Delete this recipe?")) return;
    await API.delete(`/recipes/${id}`);
    loadRecipes();
  };
  const searchRecipes = async (value) => {
    const res = await API.get(`/recipes/search?q=${value}`);
    setRecipes(res.data);
  };

  const filteredRecipes = recipes
    .filter((r) =>
      r.name.toLowerCase().includes(search.toLowerCase())
    )
    .filter((r) =>
      category === "all" ? true : r.category === category
    );
  return (
    <>
      <Navbar />
      <div style={filterBar}>
        <input
          type="text"
          placeholder="Search recipes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="all">All</option>
          <option value="veg">Veg</option>
          <option value="nonveg">Non-Veg</option>
        </select>
        {user && (
          <button onClick={() => setShowAdd(true)}>
            ➕ Add New Recipe
          </button>
        )}
      </div>
      <div style={grid}>
        {filteredRecipes.length === 0 && (
          <p style={{ textAlign: "center" }}>No recipes found</p>
        )}
        {filteredRecipes.map((r) => (
          <RecipeCard
            key={r._id}
            recipe={r}
            currentUser={user}
            onClick={() => setSelected(r)}
            onEdit={() => setEditRecipe(r)}
            onDelete={() => deleteRecipe(r._id)}
          />
        ))}
      </div>
      <RecipeModal
        recipe={selected}
        onClose={() => setSelected(null)}
      />
      {showAdd && (
        <AddRecipe
          onClose={() => setShowAdd(false)}
          onAdded={loadRecipes}
        />
      )}
      {editRecipe && (
        <EditRecipe
          recipe={editRecipe}
          onClose={() => setEditRecipe(null)}
          onUpdated={loadRecipes}
        />
      )}
    </>
  );
}
const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
  gap: "20px",
  padding: "20px",
};

const filterBar = {
  display: "flex",
  gap: "12px",
  padding: "15px",
  justifyContent: "center",
  alignItems: "center",
};