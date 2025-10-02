
const express = require('express');
const cors = require('cors');
const path = require('path');
const orderService = require('./services/orderService');
const validateOrder = require('./middleware/validateOrder');
const logger = require('./middleware/logger');

const app = express();
const PORT = process.env.PORT || 3000;


// Middleware
app.use(logger);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// API routes
app.post('/orders', validateOrder, (req, res) => {
  try {
    const order = orderService.addOrder(req.body);
    res.status(201).json(order);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

app.get('/orders/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const order = orderService.getOrderById(id);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }
  res.json({
    items: order.items,
    total: order.total,
    isBigOrder: order.isBigOrder
  });
});

app.get('/analytics/weekly', (req, res) => {
  const analytics = orderService.getWeeklyAnalytics();
  res.json(analytics);
});

// Serve static files from Vue app in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  });
}


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
