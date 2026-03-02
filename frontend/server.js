const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();

const app = express();
app.use(cors());
app.use(express.json());

// --- DATABASE ---
const db = new sqlite3.Database("database.db", (err) => {
  if (err) {
    console.error("Erreur DB:", err.message);
  } else {
    console.log("Database connecté ✔");

    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        balance INTEGER DEFAULT 0
      )
    `);
  }
});

// --- HOME ---
app.get("/", (req, res) => {
  res.send("API Lumière Du Progrès irakora ✔");
});

// --- CREATE USER ---
app.get("/create-user", (req, res) => {
  const username = req.query.username;

  if (!username) {
    return res.json({ error: "username irakenewe" });
  }

  const sql = "INSERT INTO users (username, balance) VALUES (?, 0)";
  db.run(sql, [username], function (err) {
    if (err) {
      return res.json({ error: err.message });
    }
    res.json({ message: "User created", id: this.lastID });
  });
});

// --- LIST USERS ---
app.get("/users", (req, res) => {
  db.all("SELECT * FROM users", [], (err, rows) => {
    if (err) return res.json({ error: err.message });
    res.json(rows);
  });
});

// --- GET BALANCE ---
app.get("/balance/:id", (req, res) => {
  const id = req.params.id;

  db.get("SELECT balance FROM users WHERE id = ?", [id], (err, row) => {
    if (err) return res.json({ error: err.message });
    if (!row) return res.json({ error: "User ntibaho" });

    res.json({ balance: row.balance });
  });
});

// --- DEPOSIT TOKENS ---
app.get("/deposit", (req, res) => {
  const id = req.query.id;
  const amount = parseInt(req.query.amount || "0", 10);

  if (!id || !amount) {
    return res.json({ error: "id na amount birakenewe" });
  }

  const sql = "UPDATE users SET balance = balance + ? WHERE id = ?";
  db.run(sql, [amount, id], function (err) {
    if (err) return res.json({ error: err.message });
    res.json({ message: "Deposit yakozwe ✔" });
  });
});

// --- START SERVER ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server iri ku port " + PORT);
});
