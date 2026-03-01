const API_URL = "http://localhost:3000";

// DOM Elements
const usernameInput = document.getElementById("username");
const btnCreate = document.getElementById("btn-create");
const usersDiv = document.getElementById("users");
const userSelect = document.getElementById("user-select");
const amountInput = document.getElementById("amount");
const btnDeposit = document.getElementById("btn-deposit");
const btnWithdraw = document.getElementById("btn-withdraw");

// Functions
async function fetchUsers() {
  const res = await fetch(`${API_URL}/users`);
  const users = await res.json();
  displayUsers(users);
  populateSelect(users);
}

function displayUsers(users) {
  usersDiv.innerHTML = "";
  users.forEach(u => {
    const div = document.createElement("div");
    div.className = "user";
    div.innerHTML = `ID: ${u.id} | ${u.username} | Balance: <span class="balance">${u.balance}</span>`;
    usersDiv.appendChild(div);
  });
}

function populateSelect(users) {
  userSelect.innerHTML = "";
  users.forEach(u => {
    const option = document.createElement("option");
    option.value = u.id;
    option.textContent = u.username;
    userSelect.appendChild(option);
  });
}

// Event Listeners
btnCreate.addEventListener("click", async () => {
  const username = usernameInput.value.trim();
  if (!username) return alert("Shiramo username");
  await fetch(`${API_URL}/create-user`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username })
  });
  usernameInput.value = "";
  fetchUsers();
});

btnDeposit.addEventListener("click", async () => {
  const id = userSelect.value;
  const amount = Number(amountInput.value);
  if (!amount || amount <= 0) return alert("Shiramo amafaranga > 0");
  await fetch(`${API_URL}/deposit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, amount })
  });
  amountInput.value = "";
  fetchUsers();
});

btnWithdraw.addEventListener("click", async () => {
  const id = userSelect.value;
  const amount = Number(amountInput.value);
  if (!amount || amount <= 0) return alert("Shiramo amafaranga > 0");
  await fetch(`${API_URL}/withdraw`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, amount })
  });
  amountInput.value = "";
  fetchUsers();
});

// Initialize
fetchUsers();
