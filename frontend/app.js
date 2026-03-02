// app.js - Lumière Du Progrès Frontend

const API_URL = "https://lumiere-du-progres-backend-4.onrender.com";

const usersList = document.getElementById("users-list");
const createForm = document.getElementById("create-user-form");
const depositForm = document.getElementById("deposit-form");
const withdrawForm = document.getElementById("withdraw-form");

let users = [];

// ─── Helper Functions ────────────────────────────────────────────────
async function fetchUsers() {
  try {
    const res = await fetch(`${API_URL}/users`);
    users = await res.json();
    renderUsers();
  } catch (err) {
    console.error("Error fetching users:", err);
    usersList.innerHTML = "<li>Error loading users</li>";
  }
}

function renderUsers() {
  if (!users.length) {
    usersList.innerHTML = "<li>No users found</li>";
    return;
  }
  usersList.innerHTML = users.map(user => `
    <li>
      <strong>${user.username}</strong> - Balance: ${user.balance} 
      <button onclick="selectUser('${user.id}')">Select</button>
    </li>
  `).join("");
}

let selectedUserId = null;

function selectUser(id) {
  selectedUserId = id;
  const user = users.find(u => u.id === id);
  document.getElementById("selected-user").textContent = user.username;
}

// ─── Create User ─────────────────────────────────────────────────────
createForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = document.getElementById("username").value.trim();
  if (!username) return alert("Enter a username!");

  try {
    const res = await fetch(`${API_URL}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username })
    });
    if (!res.ok) throw new Error("Failed to create user");
    document.getElementById("username").value = "";
    fetchUsers();
  } catch (err) {
    console.error(err);
    alert("Error creating user");
  }
});

// ─── Deposit ─────────────────────────────────────────────────────────
depositForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!selectedUserId) return alert("Select a user first!");
  const amount = parseFloat(document.getElementById("deposit-amount").value);
  if (isNaN(amount) || amount <= 0) return alert("Enter a valid amount!");

  try {
    const res = await fetch(`${API_URL}/balance/${selectedUserId}/deposit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount })
    });
    if (!res.ok) throw new Error("Deposit failed");
    document.getElementById("deposit-amount").value = "";
    fetchUsers();
  } catch (err) {
    console.error(err);
    alert("Error during deposit");
  }
});

// ─── Withdraw ────────────────────────────────────────────────────────
withdrawForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!selectedUserId) return alert("Select a user first!");
  const amount = parseFloat(document.getElementById("withdraw-amount").value);
  if (isNaN(amount) || amount <= 0) return alert("Enter a valid amount!");

  try {
    const res = await fetch(`${API_URL}/balance/${selectedUserId}/withdraw`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount })
    });
    if (!res.ok) throw new Error("Withdraw failed");
    document.getElementById("withdraw-amount").value = "";
    fetchUsers();
  } catch (err) {
    console.error(err);
    alert("Error during withdrawal");
  }
});

// ─── Init ───────────────────────────────────────────────────────────
window.onload = () => {
  fetchUsers();
};
