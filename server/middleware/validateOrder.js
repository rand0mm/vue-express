// Middleware для валидации заказа
module.exports = function validateOrder(req, res, next) {
  const { customerId, items } = req.body;
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Order must contain at least one item.' });
  }
  for (const item of items) {
    if (!item.productId || typeof item.qty !== 'number' || typeof item.price !== 'number') {
      return res.status(400).json({ error: 'Each item must have productId, qty, and price.' });
    }
    if (item.qty <= 0) {
      return res.status(400).json({ error: 'Item qty must be greater than 0.' });
    }
  }
  next();
};
