const db = require('../db');

async function findByEmail(email) {
  const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
  return rows[0];
}

async function createUser(user) {
  const { first_name, last_name, email, phone_number, password, role } = user;
  const [result] = await db.query(
    'INSERT INTO users (first_name, last_name, email, phone_number, password, role) VALUES (?, ?, ?, ?, ?, ?)',
    [first_name, last_name || '', email, phone_number || '', password, role || 'guest']
  );
  return result.insertId;
}

module.exports = { findByEmail, createUser };
