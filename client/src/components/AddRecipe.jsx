import { useState } from "react";
import API from "../services/api";
export default function AddRecipe({ onClose, onAdded }) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    ingredients: "",
    instructions: "",
    category: "veg",
    // image: "",
    // video: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let finalImage = imageUrl;
      let finalVideo = videoUrl;
      if (imageFile) {
        const formData = new FormData();
        formData.append("file", imageFile);
        const res = await API.post("/upload/image", formData);
        finalImage = res.data.url;
      }
      if (videoFile) {
        const formData = new FormData();
        formData.append("file", videoFile);
        const res = await API.post("/upload/video", formData);
        finalVideo = res.data.url;
      }
      const payload = {
        ...form,
        image: finalImage,
        video: finalVideo,
        ingredients: form.ingredients.split(",").map(i => i.trim()),
      };
      await API.post("/recipes", payload);
      onAdded();
      onClose();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add recipe");
    }
  };
  return (
    <div style={overlay}>
      <div style={modal}>
        <h2>Add Recipe</h2>
        <form onSubmit={handleSubmit}>
          <input
            placeholder="Name"
            onChange={e => setForm({ ...form, name: e.target.value })}
          />
          <textarea
            placeholder="Description"
            onChange={e => setForm({ ...form, description: e.target.value })}
          />
          <textarea
            placeholder="Ingredients (comma separated)"
            onChange={e => setForm({ ...form, ingredients: e.target.value })}
          />
          <textarea
            placeholder="Instructions"
            onChange={e => setForm({ ...form, instructions: e.target.value })}
          />
          <h4>Image</h4>
          {imagePreview && (
            <img
              src={imagePreview}
              alt="preview"
              style={{ width: "100%", borderRadius: "10px", marginBottom: "10px" }}
            />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              setImageFile(file);
              setImagePreview(URL.createObjectURL(file));
              setImageUrl("");
            }}
            disabled={imageUrl !== ""}
          />
          <p style={{ textAlign: "center" }}>OR</p>
          <input
            placeholder="Paste Image URL"
            value={imageUrl}
            onChange={(e) => {
              setImageUrl(e.target.value);
              setImagePreview(e.target.value);
              setImageFile(null);
            }}
            disabled={imageFile !== null}
          />
          <h4>Video</h4>
          {videoPreview && (
            <video
              src={videoPreview}
              controls
              style={{ width: "100%", borderRadius: "10px", marginBottom: "10px" }}
            />
          )}
          <input
            type="file"
            accept="video/*"
            onChange={(e) => {
              const file = e.target.files[0];
              setVideoFile(file);
              setVideoPreview(URL.createObjectURL(file));
              setVideoUrl("");
            }}
            disabled={videoUrl !== ""}
          />
          <p style={{ textAlign: "center" }}>OR</p>
          <input
            placeholder="Paste Video URL"
            value={videoUrl}
            onChange={(e) => {
              setVideoUrl(e.target.value);
              setVideoPreview(e.target.value);
              setVideoFile(null);
            }}
            disabled={videoFile !== null}
          />
          <select
            onChange={e => setForm({ ...form, category: e.target.value })}
          >
            <option value="veg">Veg</option>
            <option value="nonveg">Non-Veg</option>
            <option value="dessert">Dessert</option>
          </select>
          <button>Add</button>
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
  maxHeight: "90vh",     
  overflowY: "auto",   
  borderRadius: "12px",
};