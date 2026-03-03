const API = "https://lumiereduprogres-backend.onrender.com";

async function createUser() {
  const username = document.getElementById("username").value;

  const res = await fetch(API + "/create-user", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ username })
  });

  const data = await res.json();
  document.getElementById("result").innerText =
    "User created: " + data.username + " | Balance: " + data.balance;
}

async function makeTransaction() {
  const username = document.getElementById("username").value;
  const amount = document.getElementById("amount").value;

  const res = await fetch(API + "/transaction", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      username,
      amount: Number(amount)
    })
  });

  const data = await res.json();
  document.getElementById("result").innerText =
    "New balance: " + data.balance;
}

async function loadUsers() {
  const res = await fetch(API + "/users");
  const data = await res.json();

  document.getElementById("result").innerText =
    JSON.stringify(data, null, 2);
}
