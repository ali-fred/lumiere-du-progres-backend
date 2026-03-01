async function loadUsers() {
  const res = await fetch('/users');
  const users = await res.json();

  const tbody = document.querySelector('#usersTable tbody');
  tbody.innerHTML = ''; // Clear previous rows

  users.forEach(user => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${user.id}</td>
      <td>${user.username}</td>
      <td>${user.balance}</td>
    `;
    tbody.appendChild(row);
  });
}
