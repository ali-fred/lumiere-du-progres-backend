import express from 'express';
import cors from 'cors';
import { LowSync, JSONFileSync } from 'lowdb';
import { nanoid } from 'nanoid';

const app = express();
app.use(cors());
app.use(express.json());

const adapter = new JSONFileSync('db.json');
const db = new LowSync(adapter);
db.read();
db.data ||= { users: [] };

// Route: Create User
app.post('/create-user', (req, res) => {
  const { username } = req.body;
  const user = { id: nanoid(), username, balance: 0 };
  db.data.users.push(user);
  db.write();
  res.json(user);
});

// Route: Get Users
app.get('/users', (req, res) => {
  res.json(db.data.users);
});

// Route: Deposit
app.post('/deposit', (req, res) => {
  const { id, amount } = req.body;
  const user = db.data.users.find(u => u.id === id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  user.balance += Number(amount);
  db.write();
  res.json({ message: 'Amafaranga yongewe', user });
});

// Route: Withdraw
app.post('/withdraw', (req, res) => {
  const { id, amount } = req.body;
  const user = db.data.users.find(u => u.id === id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  if (user.balance < amount) return res.status(400).json({ message: 'Amafaranga adahagije' });
  user.balance -= Number(amount);
  db.write();
  res.json({ message: 'Amafaranga yavanywe', user });
});

app.listen(3000, () => console.log('🚀 Server irakora kuri port 3000'));
