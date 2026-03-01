const fs = require('fs');
const initSqlJs = require('sql.js');
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

let db;

// Fungura database
(async () => {
  const SQL = await initSqlJs();
  const filebuffer = fs.readFileSync('database.db');
  db = new SQL.Database(filebuffer);
  console.log("✅ Database irafunguwe neza");
  prompt(); // Tangura menu nyuma ya DB
})();

function saveDb() {
  const data = db.export();
  fs.writeFileSync('database.db', Buffer.from(data));
}

function deposit(userId, amount) {
  db.run("UPDATE users SET balance = balance + ? WHERE id = ?", [amount, userId]);
  saveDb();
  console.log(`Deposit yakozwe neza ✔. Amount: ${amount} yongerwe kuri user id ${userId}`);
}

function withdraw(userId, amount) {
  const result = db.exec("SELECT balance FROM users WHERE id = " + userId);
  const currentBalance = result[0]?.values[0][0] || 0;

  if (amount > currentBalance) {
    console.log(`❌ Ntibishoboka: user id ${userId} afise balance ${currentBalance}, arashaka gukuramo ${amount}`);
    return;
  }

  db.run("UPDATE users SET balance = balance - ? WHERE id = ?", [amount, userId]);
  saveDb();
  console.log(`Withdraw yakozwe neza ✔. Amount: ${amount} yakuwemwo kuri user id ${userId}`);
}

function showMenu() {
  console.log("\n=== Menu Lumière Du Progrès ===");
  console.log("1. Deposit");
  console.log("2. Withdraw");
  console.log("3. Check balance");
  console.log("4. Exit");
}

function prompt() {
  showMenu();
  readline.question("Hitamo option: ", option => {
    if (option === "1") {
      readline.question("User ID: ", id => {
        readline.question("Amount: ", amt => {
          deposit(parseInt(id), parseInt(amt));
          prompt();
        });
      });
    } else if (option === "2") {
      readline.question("User ID: ", id => {
        readline.question("Amount: ", amt => {
          withdraw(parseInt(id), parseInt(amt));
          prompt();
        });
      });
    } else if (option === "3") {
      readline.question("User ID: ", id => {
        const result = db.exec("SELECT balance FROM users WHERE id = " + parseInt(id));
        const balance = result[0]?.values[0][0] || 0;
        console.log(`User id ${id} afise balance ${balance}`);
        prompt();
      });
    } else if (option === "4") {
      console.log("Murakoze!! Bye 👋");
      readline.close();
    } else {
      console.log("Option ntizwi, ongera ugerageze.");
      prompt();
    }
  });
}
