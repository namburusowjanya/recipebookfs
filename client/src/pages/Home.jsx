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
  const [ingredientSearch, setIngredientSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [editRecipe, setEditRecipe] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const { user } = useContext(AuthContext);
  const loadRecipes = async () => {
    try {
      const res = await API.get("/recipes");
      setRecipes(res.data || []);
    } catch {
      alert("Failed to load recipes");
    }
  };
  useEffect(() => {
    loadRecipes();
  }, []);
  const deleteRecipe = async (id) => {
    if (!window.confirm("Delete this recipe?")) return;
    try {
      await API.delete(`/recipes/${id}`);
      loadRecipes();
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    }
  };
  const handleSearch = async (value) => {
    setSearch(value);
    if (value.trim().length < 3) return;
    try {
      await API.post("/search", { query: value.toLowerCase() });
    } catch {}
  };
  const searchText = search.toLowerCase();
  const ingredientList = ingredientSearch
    .toLowerCase()
    .split(",")
    .map((i) => i.trim())
    .filter(Boolean);

  const filteredRecipes = recipes
  .map((r) => {
    const nameMatch = r.name?.toLowerCase().includes(searchText);
    const descMatch = r.description?.toLowerCase().includes(searchText);
    const userMatch =
      r.createdBy?.username?.toLowerCase().includes(searchText);
    const categoryMatch =
      category === "all" ? true : r.category === category;
    const recipeIngredients =
      r.ingredients?.map((i) => i.toLowerCase()) || [];
    const matchedIngredients = ingredientList.filter((ing) =>
      recipeIngredients.some((rIng) => rIng.includes(ing))
    );
    return {
      recipe: r,
      textMatch: nameMatch || descMatch || userMatch,
      ingredientScore: matchedIngredients.length,
      categoryMatch,
    };
  })
  .filter((r) =>
    r.categoryMatch &&
    (
      (ingredientList.length && r.ingredientScore > 0) ||
      (!ingredientList.length && r.textMatch)
    )
  )
  .sort((a, b) => {
    if (b.ingredientScore !== a.ingredientScore) {
      return b.ingredientScore - a.ingredientScore;
    }
    return b.textMatch - a.textMatch;
  })
  .map((r) => ({
    ...r.recipe,
    matchScore: r.ingredientScore
  }));
  return (
    <>
      <Navbar />
      <div style={filterBar}>
        <input
          placeholder="Search recipes or users..."
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
        />
        <input
          placeholder="Enter ingredients (comma separated)"
          value={ingredientSearch}
          onChange={(e) => setIngredientSearch(e.target.value)}
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
      {ingredientSearch && (
        <p style={{ textAlign: "center", color: "#666" }}>
          Showing recipes matching ingredients: <b>{ingredientSearch}</b>
        </p>
      )}
      <div style={grid}>
        {filteredRecipes.length === 0 && (
          <p style={{ textAlign: "center" }}>No recipes found</p>
        )}
        {filteredRecipes.map((r) => (
          <RecipeCard
            key={r._id}
            recipe={r}
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