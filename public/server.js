const express = require('express');
const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

let db;

(async () => {
  const SQL = await initSqlJs();
  const filebuffer = fs.existsSync('database.db') ? fs.readFileSync('database.db') : null;
  db = filebuffer ? new SQL.Database(filebuffer) : new SQL.Database();

  // Table users
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT,
      balance INTEGER
    )
  `);

  // Table transactions
  db.run(`
    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      type TEXT,
      amount REAL,
      date TEXT
    )
  `);

  console.log("✅ Database irafunguwe neza");
})();

// Routes
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

app.get('/users', (req, res) => {
  const result = db.exec("SELECT * FROM users");
  const users = result[0]?.values.map(row => ({ id: row[0], username: row[1], balance: row[2] })) || [];
  res.json(users);
});

app.post('/addUser', (req, res) => {
  const { username, balance } = req.body;
  db.run("INSERT INTO users (username, balance) VALUES (?, ?)", [username, balance]);
  res.json({ message: `User ${username} yongewemwo neza ✔` });
});

app.post('/deposit', (req, res) => {
  const { userId, amount } = req.body;
  const result = db.exec(`SELECT balance FROM users WHERE id = ${userId}`);
  const current = result[0]?.values[0][0] || 0;
  const newBalance = current + amount;
  db.run(`UPDATE users SET balance = ${newBalance} WHERE id = ${userId}`);
  const now = new Date().toISOString();
  db.run(`INSERT INTO transactions (user_id, type, amount, date) VALUES (?, 'deposit', ?, ?)`, [userId, amount, now]);
  res.json({ message: "Deposit yakozwe neza ✔" });
});

app.post('/withdraw', (req, res) => {
  const { userId, amount } = req.body;
  const result = db.exec(`SELECT balance FROM users WHERE id = ${userId}`);
  const current = result[0]?.values[0][0] || 0;
  const newBalance = current - amount;
  db.run(`UPDATE users SET balance = ${newBalance} WHERE id = ${userId}`);
  const now = new Date().toISOString();
  db.run(`INSERT INTO transactions (user_id, type, amount, date) VALUES (?, 'withdraw', ?, ?)`, [userId, amount, now]);
  res.json({ message: "Withdraw yakozwe neza ✔" });
});

app.get('/transactions/:userId', (req, res) => {
  const userId = parseInt(req.params.userId);
  const result = db.exec(`SELECT type, amount, date FROM transactions WHERE user_id = ${userId} ORDER BY id DESC`);
  let transactions = [];
  if (result[0]?.values) {
    transactions = result[0].values.map(row => ({ type: row[0], amount: row[1], date: row[2] }));
  }
  res.json(transactions);
});

const PORT = 3000;
app.listen(PORT, () => console.log(`🚀 Server iriko irakora kuri port ${PORT}`));
