import { useState } from "react";
import API from "../services/api";

export default function EditRecipe({ recipe, onClose, onUpdated }) {
  const [form, setForm] = useState({
    name: recipe.name || "",
    description: recipe.description || "",
    ingredients: recipe.ingredients.join(", "),
    instructions: recipe.instructions || "",
    image: recipe.image || "",
    video: recipe.video || "",
    category: recipe.category || "veg",
  });
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/recipes/${recipe._id}`, {
        ...form,
        ingredients: form.ingredients.split(",").map(i => i.trim()),
      });
      onUpdated();
      onClose();
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    }
  };
  return (
    <div style={overlay}>
      <div style={modal}>
        <h2>Edit Recipe</h2>
        <form onSubmit={handleSubmit}>
          <input
            placeholder="Name"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            required
          />
          <textarea
            placeholder="Description"
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
          />
          <textarea
            placeholder="Ingredients (comma separated)"
            value={form.ingredients}
            onChange={e => setForm({ ...form, ingredients: e.target.value })}
          />
          <textarea
            placeholder="Instructions"
            value={form.instructions}
            onChange={e => setForm({ ...form, instructions: e.target.value })}
          />
          <input
            placeholder="Image URL"
            value={form.image}
            onChange={e => setForm({ ...form, image: e.target.value })}
          />
          <input
            placeholder="Video URL"
            value={form.video}
            onChange={e => setForm({ ...form, video: e.target.value })}
          />
          <select
            value={form.category}
            onChange={e => setForm({ ...form, category: e.target.value })}
          >
            <option value="veg">Veg</option>
            <option value="nonveg">Non-Veg</option>
          </select>
          <button type="submit">Save</button>
          <button type="button" onClick={onClose}>Cancel</button>
        </form>
      </div>
    </div>
  );
}

const overlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.6)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};
const modal = {
  background: "#fff",
  padding: "20px",
  width: "420px",
  borderRadius: "12px",
};