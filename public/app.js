    headers: { 'Content-Type': 'application/json' },
// Fetch users
function loadUsers() {
  fetch('/users')
    .then(res => res.json())
    .then(users => {
      const list = document.getElementById('user-list');
      list.innerHTML = '';
      users.forEach(u => {
        const li = document.createElement('li');
        li.textContent = `ID: ${u.id} | ${u.username} | Balance: ${u.balance}`;
        list.appendChild(li);
      });
    });
}

// Add User
function addUser() {
  const username = document.getElementById('username').value;
  const balance = document.getElementById('balance').value;
  fetch('/addUser', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, balance })
  })
  .then(res => res.json())
  .then(data => {
    alert(`User ${data.username} yashyizweho!`);
    loadUsers();
  });
}

// Deposit
function deposit() {
  const userId = document.getElementById('user-id').value;
  const amount = document.getElementById('amount').value;
  fetch('/deposit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, amount })
  })
  .then(res => res.json())
  .then(data => {
    alert(data.message);
    loadUsers();
    loadTransactions(userId);
  });
}

// Withdraw
function withdraw() {
  const userId = document.getElementById('user-id').value;
  const amount = document.getElementById('amount').value;
  fetch('/withdraw', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, amount })
  })
  .then(res => res.json())
  .then(data => {
    alert(data.message);
    loadUsers();
    loadTransactions(userId);
  });
}

// Load transactions
function loadTransactions(userId) {
  if (!userId) return;
  fetch(`/transactions/${userId}`)
    .then(res => res.json())
    .then(tx => {
      const list = document.getElementById('transactions-list');
      list.innerHTML = '';
      tx.forEach(t => {
        const li = document.createElement('li');
        li.textContent = `${t.type} | ${t.amount} | ${new Date(t.date).toLocaleString()}`;
        list.appendChild(li);
      });
    });
}

// Initial load
loadUsers();
