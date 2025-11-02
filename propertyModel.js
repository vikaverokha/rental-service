const db = require('../db');

async function getAllProperties() {
  const [rows] = await db.query('SELECT * FROM rentals_listings');
  return rows;
}

async function getPropertyById(id) {
  const [rows] = await db.query(
    'SELECT * FROM rentals_listings WHERE listing_id = ?',
    [id]
  );
  return rows[0];
}

async function createProperty(property) {
  const { owner_id, title, description, address, city, country, price_per_night, max_guests, status } = property;
  const [result] = await db.query(
    `INSERT INTO rentals_listings 
     (owner_id, title, description, address, city, country, price_per_night, max_guests, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [owner_id, title, description || '', address || '', city || '', country || '', price_per_night, max_guests || 1, status || 'active']
  );
  return result.insertId;
}

async function updateProperty(id, property) {
  const { title, description, address, city, country, price_per_night, max_guests, status } = property;
  const [result] = await db.query(
    `UPDATE rentals_listings SET
      title=?, description=?, address=?, city=?, country=?, price_per_night=?, max_guests=?, status=?
     WHERE listing_id=?`,
    [title, description, address, city, country, price_per_night, max_guests, status, id]
  );
  return result.affectedRows;
}

async function deleteProperty(id) {
  const [result] = await db.query('DELETE FROM rentals_listings WHERE listing_id = ?', [id]);
  return result.affectedRows;
}

module.exports = { getAllProperties, getPropertyById, createProperty, updateProperty, deleteProperty };
