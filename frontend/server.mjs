import express from "express";
import cors from "cors";
import { nanoid } from "nanoid";
import pkg from "lowdb";
const { Low } = pkg; // JSONFile ntabwo yitwa constructor
import { join } from "path";
import fs from "fs";

// Database setup
const file = join(process.cwd(), "database.json");

// Shyiramo JSON adapter manually
function JSONFile(filename) {
  return {
    read: async () => {
      if (!fs.existsSync(filename)) return {};
      const data = await fs.promises.readFile(filename, "utf-8");
      return JSON.parse(data);
    },
    write: async (data) => {
      await fs.promises.writeFile(filename, JSON.stringify(data, null, 2));
    },
  };
}

const adapter = JSONFile(file);
const db = new Low(adapter);

// Initialize database
await db.read();
db.data ||= { users: [] };

// Express setup
const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("🚀 Lumière Du Progrès API irakora neza");
});

app.get("/users", async (req, res) => {
  await db.read();
  res.json(db.data.users);
});

app.post("/create-user", async (req, res) => {
  const { username } = req.body;
  if (!username) return res.json({ error: "Username irakenewe" });

  const newUser = { id: nanoid(), username, balance: 0 };
  db.data.users.push(newUser);
  await db.write(db.data);
  res.json(newUser);
});

app.post("/deposit", async (req, res) => {
  const { id, amount } = req.body;
  await db.read();
  const user = db.data.users.find(u => u.id === id);
  if (!user) return res.json({ error: "User not found" });

  user.balance += Number(amount);
  await db.write(db.data);
  res.json({ message: "Amafaranga yongewe", balance: user.balance });
});

app.post("/withdraw", async (req, res) => {
  const { id, amount } = req.body;
  await db.read();
  const user = db.data.users.find(u => u.id === id);
  if (!user) return res.json({ error: "User not found" });
  if (user.balance < amount) return res.json({ error: "Amafaranga ntahagije" });

  user.balance -= Number(amount);
  await db.write(db.data);
  res.json({ message: "Amafaranga yavanywe", balance: user.balance });
});

// Start server
const PORT = 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Lumière Du Progrès irakora kuri port ${PORT}`);
});
