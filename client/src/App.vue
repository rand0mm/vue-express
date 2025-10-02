<template>
  <div id="app">
    <header>
      <h1>Vue + Express Template</h1>
    </header>
    
    <main>
      <div class="container">
        <div class="card">
          <h2>Welcome to Vue + Express!</h2>
          <p>This is a full-stack JavaScript template combining Vue.js and Express.js</p>
        </div>

        <div class="card">
          <h3>Test API Connection</h3>
          <button @click="fetchMessage" :disabled="loading">Fetch Message</button>
          <div v-if="message" class="message">{{ message }}</div>
          <div v-if="error" class="error">{{ error }}</div>
        </div>

        <div class="card">
          <h3>Features</h3>
          <ul>
            <li>✅ Vue 3 with Composition API</li>
            <li>✅ Vite for fast development</li>
            <li>✅ Express.js backend server</li>
            <li>✅ API proxy configuration</li>
            <li>✅ CORS enabled</li>
            <li>✅ Hot Module Replacement</li>
          </ul>
        </div>
      </div>
    </main>

    <footer>
      <p>Built with ❤️ using Vue.js and Express.js</p>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const message = ref('')
const error = ref('')
const loading = ref(false)

const fetchMessage = async () => {
  loading.value = true
  error.value = ''
  message.value = ''
  
  try {
    const response = await fetch('/api/hello')
    const data = await response.json()
    message.value = data.message
  } catch (err) {
    error.value = 'Failed to fetch message from server'
    console.error(err)
  } finally {
    loading.value = false
  }
}
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
  max-width: 800px;
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
  margin-top: 0;
  color: #333;
}

.card p {
  color: #666;
  line-height: 1.6;
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

ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

ul li {
  padding: 0.5rem 0;
  color: #666;
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
