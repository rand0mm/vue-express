# Vue + Express Template

A full-stack JavaScript application template combining Vue.js 3 (frontend) and Express.js (backend).

## Features

- ⚡️ **Vue 3** - Progressive JavaScript framework
- 🚀 **Vite** - Next generation frontend tooling
- 🔧 **Express.js** - Fast, unopinionated web framework
- 🔄 **Hot Module Replacement** - Instant feedback during development
- 🌐 **API Proxy** - Seamless API integration in development
- 📦 **Simple Structure** - Clean separation of frontend and backend

## Project Structure

```
vue-express/
├── client/              # Vue.js frontend
│   ├── src/
│   │   ├── App.vue     # Main application component
│   │   └── main.js     # Application entry point
│   ├── index.html      # HTML template
│   ├── vite.config.js  # Vite configuration
│   └── package.json
├── server/              # Express.js backend
│   ├── index.js        # Server entry point
│   └── package.json
└── package.json         # Root package file
```

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## Getting Started

### Installation

1. Clone the repository:
```bash
git clone https://github.com/rand0mm/vue-express.git
cd vue-express
```

2. Install all dependencies:
```bash
npm run install:all
```

This will install dependencies for the root project, server, and client.

### Development

Run both the frontend and backend in development mode:

```bash
npm run dev
```

This will start:
- Express server on http://localhost:3000
- Vue dev server on http://localhost:5173

The Vue app is configured to proxy API requests to the Express server.

### Individual Commands

Run only the backend server:
```bash
npm run server
```

Run only the frontend:
```bash
npm run client
```

### Production Build

1. Build the Vue application:
```bash
npm run build
```

2. Start the production server:
```bash
npm start
```

The Express server will serve the built Vue application from the `client/dist` folder.

## API Endpoints

The Express server includes example API endpoints:

- `GET /api/hello` - Returns a hello message
- `GET /api/status` - Returns server status and timestamp

## Customization

### Adding New API Routes

Edit `server/index.js` to add new API endpoints:

```javascript
app.get('/api/myroute', (req, res) => {
  res.json({ data: 'your data' });
});
```

### Adding Vue Components

Create new `.vue` files in the `client/src` directory and import them in `App.vue`.

### Environment Variables

Create `.env` files in the root, client, or server directories as needed.

## Technologies Used

- **Frontend:**
  - Vue.js 3
  - Vite
  
- **Backend:**
  - Express.js
  - CORS

- **Development:**
  - Nodemon (auto-restart server)
  - Concurrently (run multiple commands)

## License

MIT
