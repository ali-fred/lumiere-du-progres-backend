import express from "express";
import cors from "cors";
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";

const app = express();
app.use(cors());
app.use(express.json());

const file = "./database.json";
const adapter = new JSONFile(file);
const db = new Low(adapter);

// Initialize database
await db.read();
db.data ||= { users: [] };
await db.write();

// Routes
app.post("/user", async (req, res) => {
  const { username } = req.body;
  db.data.users.push({ username, balance: 0 });
  await db.write();
  res.json({ success: true });
});

app.post("/deposit", async (req, res) => {
  const { username, amount } = req.body;
  const user = db.data.users.find(u => u.username === username);
  if (!user) return res.status(404).json({ error: "User not found" });
  user.balance += amount;
  await db.write();
  res.json({ success: true, balance: user.balance });
});

app.post("/withdraw", async (req, res) => {
  const { username, amount } = req.body;
  const user = db.data.users.find(u => u.username === username);
  if (!user) return res.status(404).json({ error: "User not found" });
  if (user.balance < amount) return res.status(400).json({ error: "Insufficient funds" });
  user.balance -= amount;
  await db.write();
  res.json({ success: true, balance: user.balance });
});

app.get("/users", async (req, res) => {
  await db.read();
  res.json(db.data.users);
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
