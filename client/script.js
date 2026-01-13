const API = 'http://localhost:5001/api';
let token = localStorage.getItem('token');
let todos = [];

// Elements
const authDiv = document.getElementById('authContainer');
const appDiv = document.getElementById('appContainer');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const todoList = document.getElementById('todoList');
const todoModal = document.getElementById('todoModal');
const todoForm = document.getElementById('todoForm');

// Auth Toggle
document.getElementById('showSignup').onclick = (e) => {
  e.preventDefault();
  loginForm.classList.add('hidden');
  signupForm.classList.remove('hidden');
};

document.getElementById('showLogin').onclick = (e) => {
  e.preventDefault();
  signupForm.classList.add('hidden');
  loginForm.classList.remove('hidden');
};

// Login
loginForm.onsubmit = async (e) => {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;
  
  try {
    const res = await fetch(`${API}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    
    token = data.token;
    localStorage.setItem('token', token);
    showApp(data.user);
  } catch (err) {
    alert(err.message);
  }
};

// Signup
signupForm.onsubmit = async (e) => {
  e.preventDefault();
  const username = document.getElementById('signupUsername').value;
  const email = document.getElementById('signupEmail').value;
  const password = document.getElementById('signupPassword').value;
  const confirm = document.getElementById('signupConfirmPassword').value;
  
  if (password !== confirm) return alert('Passwords do not match');
  
  try {
    const res = await fetch(`${API}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    
    token = data.token;
    localStorage.setItem('token', token);
    showApp(data.user);
  } catch (err) {
    alert(err.message);
  }
};

// Show App
function showApp(user) {
  authDiv.classList.add('hidden');
  appDiv.classList.remove('hidden');
  document.getElementById('userName').textContent = user.username;
  document.getElementById('userEmail').textContent = user.email;
  document.getElementById('userInitial').textContent = user.username[0].toUpperCase();
  document.getElementById('userAvatar').style.backgroundColor = user.avatar;
  document.getElementById('currentDate').textContent = new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric'
  });
  loadTodos();
}

// Logout
document.getElementById('logoutBtn').onclick = () => {
  localStorage.removeItem('token');
  token = null;
  location.reload();
};

// Load Todos
async function loadTodos() {
  try {
    const res = await fetch(`${API}/todos`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to load todos');
    todos = data.todos || [];
    renderTodos();
    updateStats(data.stats || { total: 0, completed: 0, pending: 0 });
  } catch (err) {
    console.error('Error loading todos:', err);
    alert('Error loading todos: ' + err.message);
  }
}

// Render Todos
function renderTodos() {
  if (!todos || todos.length === 0) {
    todoList.innerHTML = '';
    document.getElementById('emptyState').classList.remove('hidden');
    return;
  }
  
  document.getElementById('emptyState').classList.add('hidden');
  todoList.innerHTML = todos.map(t => `
    <div class="todo-item ${t.completed ? 'completed' : ''}">
      <label class="todo-checkbox">
        <input type="checkbox" ${t.completed ? 'checked' : ''} onchange="toggleTodo('${t._id}')">
        <span class="checkmark"><i class="fas fa-check"></i></span>
      </label>
      <div class="todo-content">
        <div class="todo-header-row">
          <span class="todo-title">${t.title}</span>
          <span class="todo-priority ${t.priority}">${t.priority}</span>
        </div>
        <div class="todo-meta">
          <span><i class="fas fa-clock"></i> ${new Date(t.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
      <div class="todo-actions">
        <button class="todo-action-btn edit" onclick="editTodo('${t._id}')">
          <i class="fas fa-pen"></i>
        </button>
        <button class="todo-action-btn delete" onclick="deleteTodo('${t._id}')">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    </div>
  `).join('');
}

// Update Stats
function updateStats(stats) {
  const statTotal = document.getElementById('statTotal');
  const statCompleted = document.getElementById('statCompleted');
  const statPending = document.getElementById('statPending');
  const allCount = document.getElementById('allCount');
  const pendingCount = document.getElementById('pendingCount');
  const completedCount = document.getElementById('completedCount');
  
  if (statTotal) statTotal.textContent = stats.total || 0;
  if (statCompleted) statCompleted.textContent = stats.completed || 0;
  if (statPending) statPending.textContent = stats.pending || 0;
  if (allCount) allCount.textContent = stats.total || 0;
  if (pendingCount) pendingCount.textContent = stats.pending || 0;
  if (completedCount) completedCount.textContent = stats.completed || 0;
}

// Toggle Todo
async function toggleTodo(id) {
  try {
    const res = await fetch(`${API}/todos/${id}/toggle`, {
      method: 'PATCH',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Failed to toggle todo');
    await loadTodos();
  } catch (err) {
    console.error('Error toggling todo:', err);
    alert('Error updating todo');
  }
}

// Delete Todo
async function deleteTodo(id) {
  if (!confirm('Delete this task?')) return;
  try {
    const res = await fetch(`${API}/todos/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Failed to delete todo');
    await loadTodos();
  } catch (err) {
    console.error('Error deleting todo:', err);
    alert('Error deleting todo');
  }
}

// Add/Edit Modal
document.getElementById('addTaskBtn').onclick = () => openModal();
document.getElementById('emptyAddBtn').onclick = () => openModal();
document.getElementById('closeModal').onclick = closeModal;
document.getElementById('cancelModal').onclick = closeModal;

function openModal(id = null) {
  const todo = id ? todos.find(t => t._id === id) : null;
  document.getElementById('todoId').value = id || '';
  document.getElementById('todoTitle').value = todo ? todo.title : '';
  document.getElementById('todoPriority').value = todo ? todo.priority : 'medium';
  document.getElementById('modalTitle').textContent = id ? 'Edit Task' : 'Add New Task';
  todoModal.classList.remove('hidden');
}

function closeModal() {
  todoModal.classList.add('hidden');
}

function editTodo(id) {
  openModal(id);
}

// Save Todo
todoForm.onsubmit = async (e) => {
  e.preventDefault();
  const id = document.getElementById('todoId').value;
  const title = document.getElementById('todoTitle').value.trim();
  const priority = document.getElementById('todoPriority').value;
  
  if (!title) {
    alert('Please enter a title');
    return;
  }
  
  try {
    const method = id ? 'PUT' : 'POST';
    const url = id ? `${API}/todos/${id}` : `${API}/todos`;
    
    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ title, priority })
    });
    
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || 'Failed to save todo');
    }
    
    closeModal();
    await loadTodos();
  } catch (err) {
    console.error('Error saving todo:', err);
    alert('Error saving todo: ' + err.message);
  }
};

// Mobile Menu
document.getElementById('mobileMenuBtn').onclick = () => {
  document.getElementById('sidebar').classList.toggle('open');
  document.getElementById('sidebarOverlay').classList.toggle('active');
};

document.getElementById('sidebarOverlay').onclick = () => {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebarOverlay').classList.remove('active');
};

// Password Toggle
document.querySelectorAll('.toggle-password').forEach(btn => {
  btn.onclick = () => {
    const input = btn.previousElementSibling;
    input.type = input.type === 'password' ? 'text' : 'password';
    btn.querySelector('i').className = input.type === 'password' ? 'fas fa-eye' : 'fas fa-eye-slash';
  };
});

// Init
(async () => {
  document.getElementById('loadingOverlay').classList.add('fade-out');
  if (token) {
    try {
      const res = await fetch(`${API}/auth/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) showApp(data.user);
      else throw new Error();
    } catch {
      localStorage.removeItem('token');
      token = null;
    }
  }
})();
