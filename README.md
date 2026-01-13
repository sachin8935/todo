# TaskFlow - Simple Todo List App

A modern todo list application with user authentication built with Node.js, Express, MongoDB, and vanilla JavaScript.

## Features
- ✅ User signup and login with JWT authentication
- ✅ Create, edit, delete todos
- ✅ Mark todos as complete/incomplete  
- ✅ Priority levels (Low, Medium, High)
- ✅ Beautiful responsive UI
- ✅ Real-time statistics

## Tech Stack
**Backend:**
- Node.js + Express
- MongoDB + Mongoose
- JWT for authentication
- bcryptjs for password hashing

**Frontend:**
- HTML5, CSS3, JavaScript (Vanilla)
- Font Awesome icons
- Google Fonts (Inter)

## Setup

### 1. Install Dependencies
```bash
cd server
npm install
```

### 2. Configure Environment
Edit `server/.env` and update MongoDB URI if needed:
```env
PORT=5001
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

### 3. Run Server
```bash
cd server
npm start
```
Server will run at `http://localhost:5001`

### 4. Open Frontend
Simply open `client/index.html` in your browser or use Live Server.

## File Structure
```
├── client/
│   ├── index.html      # Main HTML (270 lines)
│   ├── style.css       # Styling (1800 lines)
│   └── script.js       # Frontend logic (265 lines)
└── server/
    ├── server.js       # Express server (95 lines)
    ├── .env            # Environment config
    ├── models/
    │   ├── User.js     # User model (60 lines)
    │   └── Todo.js     # Todo model (25 lines)
    ├── routes/
    │   ├── auth.js     # Auth endpoints (150 lines)
    │   └── todos.js    # Todo CRUD (70 lines)
    └── middleware/
        └── auth.js     # JWT verification (40 lines)
```

## API Endpoints

### Auth
- `POST /api/auth/signup` - Create account
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### Todos
- `GET /api/todos` - Get all todos
- `POST /api/todos` - Create todo
- `PUT /api/todos/:id` - Update todo
- `PATCH /api/todos/:id/toggle` - Toggle complete status
- `DELETE /api/todos/:id` - Delete todo

## Usage
1. Create an account using the signup form
2. Login with your credentials
3. Add tasks with title and priority
4. Click checkbox to mark complete
5. Edit or delete tasks as needed

## Production Ready
- JWT authentication with secure password hashing
- Input validation
- Error handling
- Rate limiting
- Security headers (Helmet)
- CORS configured
- MongoDB connection error handling

---
Created with ❤️ using MERN stack fundamentals
