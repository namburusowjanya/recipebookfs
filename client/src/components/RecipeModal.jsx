import { useState, useContext } from "react";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";

export default function RecipeModal({ recipe, onClose }) {
  const { user } = useContext(AuthContext);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  if (!recipe) return null;
  const reviews = recipe.reviews || [];
  const avgRating =
    reviews.length > 0
      ? (
          reviews.reduce((a, r) => a + r.rating, 0) / reviews.length
        ).toFixed(1)
      : "No ratings yet";
  const handleSubmitReview = async () => {
    if (!user) {
      alert("Please login to give a review");
      return;
    }
    // if (!comment.trim()) {
    //   alert("Please write a review");
    //   return;
    // }
    try {
      setLoading(true);
      await API.post(`/recipes/${recipe._id}/review`, {
        rating,
        comment,
      });
      alert("Review added successfully");
      window.location.reload();
    } catch (err) {
      alert("Failed to add review");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <button onClick={onClose}>❌</button>
        <h2>{recipe.name}</h2>
        <img
          src={recipe.image || "https://via.placeholder.com/400"}
          alt={recipe.name}
          style={{ width: "100%", borderRadius: "10px" }}
        />
        <p>{recipe.description}</p>
        <h4>Ingredients</h4>
        <ul>
          {recipe.ingredients.map((i, idx) => (
            <li key={idx}>{i}</li>
          ))}
        </ul>
        <h4>Instructions</h4>
        <p>{recipe.instructions}</p>
        <h4>Add Your Review</h4>
        <select
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}>
           {[5,4,3,2,1].map(n => (
            <option key={n} value={n}>
              {"⭐".repeat(n)} ({n})
            </option>
          ))}
        </select>
        <textarea
          placeholder="Write your review..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          style={{ width: "100%", marginTop: "10px" }}
        />
        <button
          onClick={handleSubmitReview}
          disabled={loading}
          style={{ marginTop: "10px" }}
        >
          {loading ? "Submitting..." : "Submit Review"}
        </button>
        <h4 style={{ marginTop: "20px" }}>Reviews</h4>
        {reviews.length === 0 && <p>No reviews yet</p>}
        {reviews.map((r, i) => (
          <div key={i} style={{ marginBottom: "10px" }}>
            <b>{r.user?.username || "User"}</b>{" "}
            {[1,2,3,4,5].map(n => (
              <span key={n}>{n <= r.rating ? "⭐" : "☆"}</span>
            ))}
            <p>{r.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "rgba(0,0,0,0.6)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center"
};
const modalStyle = {
  background: "#fff",
  padding: "20px",
  width: "400px",
  maxHeight: "80vh",
  overflowY: "auto"
};