const apiUrl = "http://localhost:3000";

window.onload = () => {
  fetchUsers();
};

function createUser() {
  const username = document.getElementById("username").value;
  if (!username) return alert("Andika username!");
  fetch(`${apiUrl}/create-user`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username })
  })
  .then(res => res.json())
  .then(user => {
    alert(`User yashyizweho: ${user.username}`);
    document.getElementById("username").value = "";
    fetchUsers();
  })
  .catch(err => console.error(err));
}

function fetchUsers() {
  fetch(`${apiUrl}/users`)
    .then(res => res.json())
    .then(users => {
      const usersList = document.getElementById("usersList");
      const userSelect = document.getElementById("userSelect");
      usersList.innerHTML = "";
      userSelect.innerHTML = "";
      users.forEach(user => {
        usersList.innerHTML += `<div class="user">ID: ${user.id} | ${user.username} | Balance: ${user.balance}</div>`;
        userSelect.innerHTML += `<option value="${user.id}">${user.username}</option>`;
      });
    })
    .catch(err => console.error(err));
}

function deposit() {
  const id = document.getElementById("userSelect").value;
  const amount = parseFloat(document.getElementById("amount").value);
  if (!amount) return alert("Shyiramo amafaranga!");
  fetch(`${apiUrl}/deposit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, amount })
  })
  .then(res => res.json())
  .then(() => {
    fetchUsers();
    document.getElementById("amount").value = "";
  })
  .catch(err => console.error(err));
}

function withdraw() {
  const id = document.getElementById("userSelect").value;
  const amount = parseFloat(document.getElementById("amount").value);
  if (!amount) return alert("Shyiramo amafaranga!");
  fetch(`${apiUrl}/withdraw`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, amount })
  })
  .then(res => res.json())
  .then(() => {
    fetchUsers();
    document.getElementById("amount").value = "";
  })
  .catch(err => console.error(err));
}
