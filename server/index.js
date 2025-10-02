const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// In-memory storage for orders
let orders = [];
let orderIdCounter = 1;

// API routes
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from Express.js!' });
});

app.get('/api/status', (req, res) => {
  res.json({ 
    status: 'OK',
    timestamp: new Date().toISOString()
  });
});

// Order Management API

// POST /api/orders - Create a new order
app.post('/api/orders', (req, res) => {
  const { customerId, items } = req.body;

  // Validate required fields
  if (!customerId) {
    return res.status(400).json({ error: 'customerId is required' });
  }

  // Validate items array
  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Order must contain at least one item' });
  }

  // Validate each item
  for (const item of items) {
    if (!item.productId || item.qty == null || item.price == null) {
      return res.status(400).json({ error: 'Each item must have productId, qty, and price' });
    }
    
    // Validate qty is positive
    if (item.qty <= 0) {
      return res.status(400).json({ error: 'Item quantity must be greater than 0' });
    }

    // Validate price is non-negative
    if (item.price < 0) {
      return res.status(400).json({ error: 'Item price cannot be negative' });
    }
  }

  // Create new order
  const order = {
    id: orderIdCounter++,
    customerId,
    items,
    createdAt: new Date().toISOString()
  };

  orders.push(order);

  res.status(201).json({
    id: order.id,
    message: 'Order created successfully'
  });
});

// GET /api/orders/:id - Get order by ID
app.get('/api/orders/:id', (req, res) => {
  const orderId = parseInt(req.params.id);

  if (isNaN(orderId)) {
    return res.status(400).json({ error: 'Invalid order ID' });
  }

  const order = orders.find(o => o.id === orderId);

  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  // Calculate total amount
  const totalAmount = order.items.reduce((sum, item) => {
    return sum + (item.qty * item.price);
  }, 0);

  // Determine if it's a big order
  const isBigOrder = totalAmount >= 10000;

  res.json({
    id: order.id,
    customerId: order.customerId,
    items: order.items,
    totalAmount,
    isBigOrder,
    createdAt: order.createdAt
  });
});

// GET /api/analytics/weekly - Get analytics for the last 7 days
app.get('/api/analytics/weekly', (req, res) => {
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  // Filter orders from the last 7 days
  const recentOrders = orders.filter(order => {
    const orderDate = new Date(order.createdAt);
    return orderDate >= sevenDaysAgo;
  });

  // Calculate metrics
  const ordersCount = recentOrders.length;
  
  let totalAmount = 0;
  let bigOrdersCount = 0;
  const uniqueCustomersSet = new Set();

  recentOrders.forEach(order => {
    const orderTotal = order.items.reduce((sum, item) => {
      return sum + (item.qty * item.price);
    }, 0);

    totalAmount += orderTotal;
    
    if (orderTotal >= 10000) {
      bigOrdersCount++;
    }

    uniqueCustomersSet.add(order.customerId);
  });

  res.json({
    ordersCount,
    totalAmount,
    bigOrdersCount,
    uniqueCustomers: uniqueCustomersSet.size
  });
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
