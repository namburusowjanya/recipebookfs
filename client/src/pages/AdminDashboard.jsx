import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  useEffect(() => {
    API.get("/admin/stats").then(res => setStats(res.data));
  }, []);
  if (!stats) return <p>Loading...</p>;
  return (
    <>
      <Navbar />
      <div style={{ padding: "30px", textAlign: "center" }}>
        <h2>Admin Dashboard</h2>
        <div style={grid}>
          <Card label="Users" value={stats.users} />
          <Card label="Recipes" value={stats.recipes} />
          <Card label="Reviews" value={stats.reviews} />
          <Card label="Likes" value={stats.likes} />
          <Card label="Top Searches" value={stats.topSearches.map(s => (
  <p key={s._id}>{s.query} — {s.count}</p>))} />
        </div>
      </div>
    </>
  );
}
function Card({ label, value }) {
  return (
    <div style={card}>
      <h3>{label}</h3>
      <p>{value}</p>
    </div>
  );
}
const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(200px,1fr))",
  gap: "20px",
  marginTop: "20px",
};
const card = {
  background: "#fff",
  padding: "20px",
  borderRadius: "15px",
  boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
};