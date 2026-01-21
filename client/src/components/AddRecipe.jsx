import { useState } from "react";
import API from "../services/api";
export default function AddRecipe({ onClose, onAdded }) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    ingredients: "",
    instructions: "",
    category: "veg",
    image: "",
    video: ""
  });
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        ingredients: form.ingredients.split(",").map(i => i.trim()),
      };
      await API.post("/recipes", payload);
      onAdded();
      onClose();
    } catch (err) {
      if (err.response?.status === 401) {
        alert("Please login to add a recipe");
      } else {
        alert("Failed to add recipe");
      }
    }
  };
  return (
    <div style={overlay}>
      <div style={modal}>
        <h2>Add Recipe</h2>
        <form onSubmit={handleSubmit}>
          <input placeholder="Name" onChange={e => setForm({...form, name:e.target.value})} />
          <textarea placeholder="Description" onChange={e => setForm({...form, description:e.target.value})} />
          <textarea placeholder="Ingredients (comma separated)" onChange={e => setForm({...form, ingredients:e.target.value})} />
          <textarea placeholder="Instructions" onChange={e => setForm({...form, instructions:e.target.value})} />
          <input type="file" accept="image/*" onChange={(e) => setForm({ ...form, image: e.target.files[0] })}/>
          <input type="file" accept="video/*" onChange={(e) => setForm({ ...form, video: e.target.files[0] })}/>
          <select onChange={e => setForm({...form, category:e.target.value})}>
            <option value="veg">Veg</option>
            <option value="nonveg">Non-Veg</option>
          </select>
          <button>Add</button>
          <button type="button" onClick={onClose}>Cancel</button>
        </form>
      </div>
    </div>
  );
}
const overlay = {
  position:"fixed",
  inset:0,
  background:"rgba(0,0,0,0.6)",
  display:"flex",
  justifyContent:"center",
  alignItems:"center"
};
const modal = {
  background:"#fff",
  padding:"20px",
  width:"400px"
};