const express = require("express");
const cors = require("cors");
const { nanoid } = require("nanoid");
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");

const adapter = new FileSync("database.json");
const db = low(adapter);

db.defaults({ users: [] }).write();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("🚀 Lumière Du Progrès API irakora neza");
});

app.get("/users", (req, res) => {
  res.json(db.get("users").value());
});

app.post("/create-user", (req, res) => {
  const { username } = req.body;
  if (!username) return res.json({ error: "Username irakenewe" });

  const newUser = { id: nanoid(), username, balance: 0 };
  db.get("users").push(newUser).write();
  res.json(newUser);
});

app.post("/deposit", (req, res) => {
  const { id, amount } = req.body;
  const user = db.get("users").find({ id }).value();
  if (!user) return res.json({ error: "User not found" });

  const newBalance = user.balance + Number(amount);
  db.get("users").find({ id }).assign({ balance: newBalance }).write();

  res.json({ message: "Amafaranga yongewe", balance: newBalance });
});

app.post("/withdraw", (req, res) => {
  const { id, amount } = req.body;
  const user = db.get("users").find({ id }).value();
  if (!user) return res.json({ error: "User not found" });
  if (user.balance < amount) return res.json({ error: "Amafaranga ntahagije" });

  const newBalance = user.balance - Number(amount);
  db.get("users").find({ id }).assign({ balance: newBalance }).write();

  res.json({ message: "Amafaranga yavanywe", balance: newBalance });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("🚀 Server running on port " + PORT);
});
