const apiUrl = "http://localhost:3000";

async function fetchUsers() {
  const res = await fetch(`${apiUrl}/users`);
  const users = await res.json();
  const usersList = document.getElementById("usersList");
  const userSelect = document.getElementById("userSelect");

  usersList.innerHTML = "";
  userSelect.innerHTML = "";

  users.forEach(user => {
    const li = document.createElement("li");
    li.textContent = `ID: ${user.id} | ${user.username} | Balance: ${user.balance}`;
    usersList.appendChild(li);

    const option = document.createElement("option");
    option.value = user.id;
    option.textContent = user.username;
    userSelect.appendChild(option);
  });
}

async function createUser() {
  const username = document.getElementById("username").value;
  if (!username) return alert("Shyiramo username");
  await fetch(`${apiUrl}/create-user`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username })
  });
  document.getElementById("username").value = "";
  fetchUsers();
}

async function deposit() {
  const id = document.getElementById("userSelect").value;
  const amount = Number(document.getElementById("amount").value);
  if (!id || !amount) return alert("Hitamo user kandi shyiramo amount");
  await fetch(`${apiUrl}/deposit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, amount })
  });
  document.getElementById("amount").value = "";
  fetchUsers();
}

async function withdraw() {
  const id = document.getElementById("userSelect").value;
  const amount = Number(document.getElementById("amount").value);
  if (!id || !amount) return alert("Hitamo user kandi shyiramo amount");
  const res = await fetch(`${apiUrl}/withdraw`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, amount })
  });
  const data = await res.json();
  if (data.error) alert(data.error);
  document.getElementById("amount").value = "";
  fetchUsers();
}

fetchUsers();
