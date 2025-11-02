const propertyModel = require('../models/propertyModel');

async function getProperties(req, res) {
  try {
    const properties = await propertyModel.getAllProperties();
    res.json(properties);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

async function getProperty(req, res) {
  try {
    const property = await propertyModel.getPropertyById(req.params.id);
    if (!property) return res.status(404).json({ message: 'Не найдено' });
    res.json(property);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

async function createProperty(req, res) {
  if (req.user.role !== 'host') return res.status(403).json({ message: 'Только арендодатели могут добавлять объекты' });
  try {
    const property = { ...req.body, owner_id: req.user.user_id };
    const id = await propertyModel.createProperty(property);
    res.json({ message: 'Объект создан', listing_id: id });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

async function updateProperty(req, res) {
  try {
    const property = await propertyModel.getPropertyById(req.params.id);
    if (!property) return res.status(404).json({ message: 'Не найдено' });
    if (property.owner_id !== req.user.user_id) return res.status(403).json({ message: 'Можно обновлять только свои объекты' });

    await propertyModel.updateProperty(req.params.id, req.body);
    res.json({ message: 'Объект обновлён' });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

async function deleteProperty(req, res) {
  try {
    const property = await propertyModel.getPropertyById(req.params.id);
    if (!property) return res.status(404).json({ message: 'Не найдено' });
    if (property.owner_id !== req.user.user_id) return res.status(403).json({ message: 'Можно удалять только свои объекты' });

    await propertyModel.deleteProperty(req.params.id);
    res.json({ message: 'Объект удалён' });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

module.exports = { getProperties, getProperty, createProperty, updateProperty, deleteProperty };
