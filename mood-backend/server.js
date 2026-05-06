const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json());

const FILE = "data.json";

// load data
function loadData() {
  if (!fs.existsSync(FILE)) return {};
  return JSON.parse(fs.readFileSync(FILE));
}

// save data
function saveData(data) {
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
}

// login (create user if not exists)
app.post("/login", (req, res) => {
  const { username } = req.body;
  if (!username) return res.status(400).json({ error: "Username required" });

  const data = loadData();
  if (!data[username]) {
    data[username] = [];
    saveData(data);
  }

  res.json({ message: "Login success", username });
});

// get moods for user
app.get("/moods/:username", (req, res) => {
  const data = loadData();
  res.json(data[req.params.username] || []);
});

// save mood
app.post("/moods/:username", (req, res) => {
  const data = loadData();
  const { username } = req.params;

  if (!data[username]) data[username] = [];
  data[username].push(req.body);

  saveData(data);
  res.json({ message: "Mood saved" });
});

app.listen(3000, () => {
  console.log("✅ Server running on http://localhost:3000");
});