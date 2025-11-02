const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');
const SECRET = process.env.JWT_SECRET || 'secret_key';

async function register(req, res) {
  try {
    const { first_name, last_name, email, phone_number, password, role } = req.body;
    if (!first_name || !email || !password) return res.status(400).json({ error: 'Заполните все обязательные поля' });

    const existing = await userModel.findByEmail(email);
    if (existing) return res.status(400).json({ error: 'Email уже используется' });

    const hashed = await bcrypt.hash(password, 10);
    const user_id = await userModel.createUser({ first_name, last_name, email, phone_number, password: hashed, role });

    res.json({ message: 'Пользователь создан', user_id });
  } catch (e) {
    res.status(500).json({ error: 'Ошибка регистрации', details: e.message });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await userModel.findByEmail(email);
    if (!user) return res.status(400).json({ error: 'Неверный email или пароль' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: 'Неверный email или пароль' });

    const token = jwt.sign({ user_id: user.user_id, role: user.role }, SECRET, { expiresIn: '2h' });
    res.json({ token, user: { user_id: user.user_id, role: user.role } });
  } catch (e) {
    res.status(500).json({ error: 'Ошибка входа', details: e.message });
  }
}

function authenticate(req, res, next) {
  const header = req.headers['authorization'];
  if (!header) return res.status(401).json({ error: 'Нет токена' });

  const token = header.split(' ')[1];
  try {
    req.user = jwt.verify(token, SECRET);
    next();
  } catch (e) {
    res.status(401).json({ error: 'Неверный токен' });
  }
}

module.exports = { register, login, authenticate };
