const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

const authRoutes = require('./routes/authRoutes');
const propertyRoutes = require('./routes/propertyRoutes');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);

app.listen(PORT, () => console.log(`✅ Server running at http://localhost:${PORT}`));
