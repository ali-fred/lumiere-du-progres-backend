const API_URL = "https://lumiere-du-progres-backend.onrender.com";

async function createUser() {
  const username = document.getElementById("username").value;

  if (!username) {
    alert("Shiramwo username");
    return;
  }

  try {
    const res = await fetch(API_URL + "/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username })
    });

    const data = await res.json();
    alert("User créé ✔");
    loadUsers();
  } catch (err) {
    alert("Backend iri kwiyugurura... tegereza gato ⏳");
  }
}

async function loadUsers() {
  try {
    const res = await fetch(API_URL + "/users");
    const users = await res.json();

    const list = document.getElementById("users");
    list.innerHTML = "";

    users.forEach(u => {
      const li = document.createElement("li");
      li.innerText = `${u.username} — Balance: ${u.balance}`;
      list.appendChild(li);
    });

  } catch {
    console.log("Backend ntiravyuka");
  }
}

async function transaction(type) {
  const id = document.getElementById("userId").value;
  const amount = document.getElementById("amount").value;

  try {
    await fetch(API_URL + "/transaction", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, amount, type })
    });

    alert("Transaction yakozwe ✔");
    loadUsers();

  } catch {
    alert("Backend iriko iratangura... ⏳");
  }
}

loadUsers();
