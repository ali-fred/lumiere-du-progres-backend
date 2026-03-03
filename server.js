import express from "express";
import cors from "cors";
import { Low, JSONFile } from "lowdb";
import { nanoid } from "nanoid";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Setup database
const adapter = new JSONFile("db.json");
const db = new Low(adapter);

await db.read();
db.data ||= { users: [] };
await db.write();

// =======================
// ROUTES
// =======================

app.get("/", (req, res) => {
  res.json({ message: "API Lumière Du Progrès irakora ✔" });
});

app.get("/users", async (req, res) => {
  await db.read();
  res.json(db.data.users);
});

app.post("/users", async (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ message: "Username required" });
  }

  await db.read();

  const exists = db.data.users.find(u => u.username === username);
  if (exists) {
    return res.status(400).json({ message: "User already exists" });
  }

  const newUser = {
    id: nanoid(),
    username,
    balance: 0
  };

  db.data.users.push(newUser);
  await db.write();

  res.json({ message: "User created successfully" });
});

app.post("/deposit", async (req, res) => {
  const { username, amount } = req.body;

  await db.read();

  const user = db.data.users.find(u => u.username === username);
  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  user.balance += Number(amount);
  await db.write();

  res.json({ message: "Deposit successful" });
});

app.post("/withdraw", async (req, res) => {
  const { username, amount } = req.body;

  await db.read();

  const user = db.data.users.find(u => u.username === username);
  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  if (user.balance < Number(amount)) {
    return res.status(400).json({ message: "Insufficient balance" });
  }

  user.balance -= Number(amount);
  await db.write();

  res.json({ message: "Withdraw successful" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
