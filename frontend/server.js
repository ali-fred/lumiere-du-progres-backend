import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";

const app = express();
const PORT = process.env.PORT || 10000;
const DATABASE_FILE = "./database.json";

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Functions zo gusoma no kwandika database
function readDatabase() {
  try {
    const data = fs.readFileSync(DATABASE_FILE, "utf8");
    return JSON.parse(data);
  } catch {
    return { users: [] };
  }
}

function writeDatabase(data) {
  fs.writeFileSync(DATABASE_FILE, JSON.stringify(data, null, 2));
}

// Routes
app.get("/", (req, res) => {
  res.send("🚀 Lumière Du Progrès API irakora neza");
});

// Route yo kubona users
app.get("/users", (req, res) => {
  const db = readDatabase();
  res.json(db.users);
});

// Route yo gukora user nshya
app.post("/create-user", (req, res) => {
  const { username } = req.body;
  if (!username) return res.status(400).json({ error: "Username required" });

  const db = readDatabase();
  const newUser = { id: uuidv4(), username, balance: 0 };
  db.users.push(newUser);
  writeDatabase(db);
  res.json(newUser);
});

// Route yo gukora dépôt / retrait
app.post("/transaction", (req, res) => {
  const { username, amount } = req.body;
  if (!username || typeof amount !== "number") {
    return res.status(400).json({ error: "Username and amount required" });
  }

  const db = readDatabase();
  const user = db.users.find(u => u.username === username);
  if (!user) return res.status(404).json({ error: "User not found" });

  user.balance += amount;
  writeDatabase(db);

  res.json({ username: user.username, balance: user.balance });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
