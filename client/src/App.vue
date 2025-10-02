<template>
  <div id="app">
    <header>
      <h1>Order Management System</h1>
    </header>
    
    <main>
      <div class="container">
        <!-- Create Order Form -->
        <div class="card">
          <h2>Create New Order</h2>
          <form @submit.prevent="createOrder">
            <div class="form-group">
              <label>Customer ID:</label>
              <input v-model="newOrder.customerId" type="text" required placeholder="Enter customer ID">
            </div>
            
            <div class="items-section">
              <h3>Order Items</h3>
              <div v-for="(item, index) in newOrder.items" :key="index" class="item-row">
                <input v-model="item.productId" type="text" placeholder="Product ID" required>
                <input v-model.number="item.qty" type="number" placeholder="Quantity" min="1" required>
                <input v-model.number="item.price" type="number" placeholder="Price" min="0" step="0.01" required>
                <button type="button" @click="removeItem(index)" class="btn-remove">Remove</button>
              </div>
              <button type="button" @click="addItem" class="btn-secondary">Add Item</button>
            </div>

            <button type="submit" :disabled="loading">Create Order</button>
          </form>
          <div v-if="createMessage" class="message">{{ createMessage }}</div>
          <div v-if="createError" class="error">{{ createError }}</div>
        </div>

        <!-- View Order -->
        <div class="card">
          <h2>View Order</h2>
          <div class="form-group">
            <label>Order ID:</label>
            <input v-model.number="orderId" type="number" placeholder="Enter order ID">
            <button @click="getOrder" :disabled="loading">Get Order</button>
          </div>
          
          <div v-if="orderDetails" class="order-details">
            <h3>Order #{{ orderDetails.id }}</h3>
            <p><strong>Customer ID:</strong> {{ orderDetails.customerId }}</p>
            <p><strong>Created:</strong> {{ formatDate(orderDetails.createdAt) }}</p>
            <p><strong>Total Amount:</strong> ${{ orderDetails.totalAmount.toFixed(2) }}</p>
            <p><strong>Big Order:</strong> {{ orderDetails.isBigOrder ? '✅ Yes' : '❌ No' }}</p>
            
            <h4>Items:</h4>
            <table>
              <thead>
                <tr>
                  <th>Product ID</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in orderDetails.items" :key="index">
                  <td>{{ item.productId }}</td>
                  <td>{{ item.qty }}</td>
                  <td>${{ item.price.toFixed(2) }}</td>
                  <td>${{ (item.qty * item.price).toFixed(2) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-if="viewError" class="error">{{ viewError }}</div>
        </div>

        <!-- Analytics -->
        <div class="card">
          <h2>Weekly Analytics</h2>
          <button @click="getAnalytics" :disabled="loading">Refresh Analytics</button>
          
          <div v-if="analytics" class="analytics">
            <div class="stat">
              <div class="stat-value">{{ analytics.ordersCount }}</div>
              <div class="stat-label">Total Orders</div>
            </div>
            <div class="stat">
              <div class="stat-value">${{ analytics.totalAmount.toFixed(2) }}</div>
              <div class="stat-label">Total Amount</div>
            </div>
            <div class="stat">
              <div class="stat-value">{{ analytics.bigOrdersCount }}</div>
              <div class="stat-label">Big Orders</div>
            </div>
            <div class="stat">
              <div class="stat-value">{{ analytics.uniqueCustomers }}</div>
              <div class="stat-label">Unique Customers</div>
            </div>
          </div>
          <div v-if="analyticsError" class="error">{{ analyticsError }}</div>
        </div>
      </div>
    </main>

    <footer>
      <p>Built with ❤️ using Vue.js and Express.js</p>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// Create Order
const newOrder = ref({
  customerId: '',
  items: [{ productId: '', qty: 1, price: 0 }]
})
const createMessage = ref('')
const createError = ref('')

// View Order
const orderId = ref('')
const orderDetails = ref(null)
const viewError = ref('')

// Analytics
const analytics = ref(null)
const analyticsError = ref('')

const loading = ref(false)

const addItem = () => {
  newOrder.value.items.push({ productId: '', qty: 1, price: 0 })
}

const removeItem = (index) => {
  if (newOrder.value.items.length > 1) {
    newOrder.value.items.splice(index, 1)
  }
}

const createOrder = async () => {
  loading.value = true
  createMessage.value = ''
  createError.value = ''
  
  try {
    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newOrder.value)
    })
    
    const data = await response.json()
    
    if (response.ok) {
      createMessage.value = `Order #${data.id} created successfully!`
      // Reset form
      newOrder.value = {
        customerId: '',
        items: [{ productId: '', qty: 1, price: 0 }]
      }
    } else {
      createError.value = data.error || 'Failed to create order'
    }
  } catch (err) {
    createError.value = 'Failed to create order'
    console.error(err)
  } finally {
    loading.value = false
  }
}

const getOrder = async () => {
  if (!orderId.value) return
  
  loading.value = true
  viewError.value = ''
  orderDetails.value = null
  
  try {
    const response = await fetch(`/api/orders/${orderId.value}`)
    const data = await response.json()
    
    if (response.ok) {
      orderDetails.value = data
    } else {
      viewError.value = data.error || 'Order not found'
    }
  } catch (err) {
    viewError.value = 'Failed to fetch order'
    console.error(err)
  } finally {
    loading.value = false
  }
}

const getAnalytics = async () => {
  loading.value = true
  analyticsError.value = ''
  
  try {
    const response = await fetch('/api/analytics/weekly')
    const data = await response.json()
    
    if (response.ok) {
      analytics.value = data
    } else {
      analyticsError.value = 'Failed to fetch analytics'
    }
  } catch (err) {
    analyticsError.value = 'Failed to fetch analytics'
    console.error(err)
  } finally {
    loading.value = false
  }
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString()
}

// Load analytics on mount
onMounted(() => {
  getAnalytics()
})
</script>

<style scoped>
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem;
  text-align: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

header h1 {
  margin: 0;
  font-size: 2.5rem;
}

main {
  flex: 1;
  padding: 2rem;
  background: #f5f5f5;
}

.container {
  max-width: 1000px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.card {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.card h2 {
  margin-top: 0;
  color: #667eea;
}

.card h3 {
  margin-top: 1rem;
  margin-bottom: 0.5rem;
  color: #333;
  font-size: 1.2rem;
}

.card h4 {
  margin-top: 1rem;
  margin-bottom: 0.5rem;
  color: #555;
}

.card p {
  color: #666;
  line-height: 1.6;
  margin: 0.5rem 0;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #333;
  font-weight: 500;
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  box-sizing: border-box;
}

.items-section {
  margin: 1.5rem 0;
  padding: 1rem;
  background: #f9f9f9;
  border-radius: 4px;
}

.item-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr auto;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.item-row input {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9rem;
}

button {
  background: #667eea;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s;
}

button:hover:not(:disabled) {
  background: #5568d3;
}

button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.btn-secondary {
  background: #6c757d;
}

.btn-secondary:hover:not(:disabled) {
  background: #5a6268;
}

.btn-remove {
  background: #dc3545;
  padding: 0.5rem 1rem;
}

.btn-remove:hover:not(:disabled) {
  background: #c82333;
}

.message {
  margin-top: 1rem;
  padding: 1rem;
  background: #e7f3e7;
  border-left: 4px solid #4caf50;
  border-radius: 4px;
  color: #2e7d32;
}

.error {
  margin-top: 1rem;
  padding: 1rem;
  background: #ffebee;
  border-left: 4px solid #f44336;
  border-radius: 4px;
  color: #c62828;
}

.order-details {
  margin-top: 1rem;
  padding: 1rem;
  background: #f9f9f9;
  border-radius: 4px;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}

table th,
table td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

table th {
  background: #f5f5f5;
  font-weight: 600;
  color: #333;
}

table tr:hover {
  background: #f9f9f9;
}

.analytics {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.stat {
  background: #f9f9f9;
  padding: 1.5rem;
  border-radius: 4px;
  text-align: center;
  border-left: 4px solid #667eea;
}

.stat-value {
  font-size: 2rem;
  font-weight: bold;
  color: #667eea;
  margin-bottom: 0.5rem;
}

.stat-label {
  color: #666;
  font-size: 0.9rem;
}

footer {
  background: #333;
  color: white;
  text-align: center;
  padding: 1.5rem;
}

footer p {
  margin: 0;
}
</style>
