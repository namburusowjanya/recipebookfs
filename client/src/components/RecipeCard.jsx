import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import API from "../services/api";
import "../styles/app.css";
export default function RecipeCard({ recipe, onClick, onEdit, onDelete }) {
  const { user } = useContext(AuthContext);
  const [likesCount, setLikesCount] = useState(
    recipe.likes ? recipe.likes.length : 0
  );
  const isOwner =
    user &&
    recipe.createdBy &&
    (recipe.createdBy._id === user._id ||
      recipe.createdBy === user._id);
  const isAdmin = user?.role === "admin";
  const handleLike = async (e) => {
    e.stopPropagation();
    if (!user) {
      alert("Please login to like a recipe");
      return;
    }
    try {
      const res = await API.post(`/recipes/${recipe._id}/like`);
      setLikesCount(res.data.likes.length);
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    }
  };
 
  const handleWatchVideo = (e) => {
    e.stopPropagation();
    if (!recipe.video) {
      alert("No video available");
      return;
    }
    window.open(recipe.video, "_blank");
  };
  const avgRating =
    recipe.reviews?.length > 0
      ? (recipe.reviews.reduce((a, r) => a + r.rating, 0) /
          recipe.reviews.length
        ) : 0;
    const getTopReview = (reviews = []) => {
    if (!reviews.length) return null;

    return reviews.reduce((best, current) =>
      current.rating > best.rating ? current : best
    );
  };
  const topReview = getTopReview(recipe.reviews);
  return (
    <div className="recipe-card">
      <img
        src={recipe.image || "https://via.placeholder.com/300"}
        alt={recipe.name}
        onClick={onClick}
      />
      <div className="side-actions">
        <button onClick={handleLike}>❤️{likesCount}</button>
        <button onClick={handleLike}>👎</button>
        <button onClick={onClick}>💬</button>
      </div>
      <div className="recipe-card-content">
        {recipe.matchScore > 0 && (
          <p style={{ color: "green", fontSize: "0.8rem" }}>
            Matches {recipe.matchScore} ingredients
          </p>
        )}
        <p className="hint-text">Click image to see more details</p>
        <h3>{recipe.name}</h3>
        <p>{recipe.description}</p>
        <small>Category: {recipe.category}</small>
        <div className="rating-stars">
          {[1,2,3,4,5].map(n => (
            <span key={n}>
              {n <= Math.round(avgRating) ? "⭐" : "☆"}
            </span>
          ))}
          <span style={{ marginLeft: "5px" }}>
            ({avgRating ? avgRating.toFixed(1) : "0.0"})
          </span>
        </div>
        <div>
          <h4>Top Review</h4>
          {!topReview && <p>No reviews yet</p>}
          {topReview && (
            <p>
              ⭐ {topReview.rating} — 
              <b>{topReview.user?.username || "User"}</b>:
              {topReview.comment}
            </p>
          )}
        </div>
        <div>
          {recipe.createdBy?.role !== "admin" && (
          <p className="author-name">
            Recipe Added by: {recipe.createdBy?.username}
          </p>
          )}
        </div>
        <div className="button-row">
          <button onClick={handleWatchVideo}>
            🎥 Watch Video
          </button>
        </div>
        {(isAdmin || isOwner) && (
          <div className="card-actions">
            <button className="edit-btn" onClick={onEdit}>Edit</button>
            <button className="delete-btn" onClick={onDelete}>Delete</button>
          </div>
        )}
      </div>
    </div>
  );
}