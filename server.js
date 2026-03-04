import express from "express";
import cors from "cors";
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";

const app = express();
app.use(cors());
app.use(express.json());

// Database setup
const adapter = new JSONFile("db.json");
const db = new Low(adapter);

await db.read();
db.data ||= { users: [] };

// Home route
app.get("/", (req, res) => {
  res.json({ message: "Lumière Du Progrès API running" });
});

// Get users
app.get("/users", (req, res) => {
  res.json(db.data.users);
});

// Create user
app.post("/create-user", async (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ error: "Username required" });
  }

  const exists = db.data.users.find(u => u.username === username);
  if (exists) {
    return res.status(400).json({ error: "User already exists" });
  }

  const newUser = {
    id: crypto.randomUUID(),
    username,
    balance: 0
  };

  db.data.users.push(newUser);
  await db.write();

  res.json(newUser);
});

// Deposit
app.post("/deposit", async (req, res) => {
  const { username, amount } = req.body;

  if (!username || !amount) {
    return res.status(400).json({ error: "Missing data" });
  }

  const user = db.data.users.find(u => u.username === username);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  user.balance += Number(amount);
  await db.write();

  res.json({ success: true, balance: user.balance });
});

// Withdraw
app.post("/withdraw", async (req, res) => {
  const { username, amount } = req.body;

  if (!username || !amount) {
    return res.status(400).json({ error: "Missing data" });
  }

  const user = db.data.users.find(u => u.username === username);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  if (user.balance < amount) {
    return res.status(400).json({ error: "Insufficient balance" });
  }

  user.balance -= Number(amount);
  await db.write();

  res.json({ success: true, balance: user.balance });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
