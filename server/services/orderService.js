let orders = [];

function calculateOrderTotal(items) {
  return items.reduce((sum, item) => sum + item.qty * item.price, 0);
}

function isBigOrder(total) {
  return total >= 10000;
}

function addOrder(order) {
  const total = calculateOrderTotal(order.items);
  const newOrder = {
    ...order,
    id: orders.length + 1,
    total,
    isBigOrder: isBigOrder(total),
    createdAt: new Date()
  };
  orders.push(newOrder);
  return newOrder;
}

function getOrderById(id) {
  return orders.find(o => o.id === id);
}

function getWeeklyAnalytics() {
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const recentOrders = orders.filter(o => o.createdAt >= weekAgo);
  const ordersCount = recentOrders.length;
  const totalAmount = recentOrders.reduce((sum, o) => sum + o.total, 0);
  const bigOrdersCount = recentOrders.filter(o => o.isBigOrder).length;
  const uniqueCustomers = new Set(recentOrders.map(o => o.customerId)).size;
  return { ordersCount, totalAmount, bigOrdersCount, uniqueCustomers };
}

module.exports = {
  addOrder,
  getOrderById,
  getWeeklyAnalytics,
  calculateOrderTotal,
  isBigOrder
};
