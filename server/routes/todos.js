const express = require('express');
const Todo = require('../models/Todo');
const { protect } = require('../middleware/auth');

const router = express.Router();
router.use(protect);

// Get all todos
router.get('/', async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.user._id }).sort({ createdAt: -1 });
    const total = todos.length;
    const completed = todos.filter(t => t.completed).length;
    res.json({ todos, stats: { total, completed, pending: total - completed } });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching todos' });
  }
});

// Create todo
router.post('/', async (req, res) => {
  try {
    const { title, priority } = req.body;
    if (!title) return res.status(400).json({ error: 'Title required' });
    const todo = await Todo.create({ user: req.user._id, title, priority: priority || 'medium' });
    res.status(201).json({ message: 'Todo created', todo });
  } catch (error) {
    res.status(500).json({ error: 'Error creating todo' });
  }
});

// Update todo
router.put('/:id', async (req, res) => {
  try {
    const { title, priority } = req.body;
    const todo = await Todo.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { title, priority },
      { new: true }
    );
    if (!todo) return res.status(404).json({ error: 'Todo not found' });
    res.json({ message: 'Todo updated', todo });
  } catch (error) {
    res.status(500).json({ error: 'Error updating todo' });
  }
});

// Toggle todo
router.patch('/:id/toggle', async (req, res) => {
  try {
    const todo = await Todo.findOne({ _id: req.params.id, user: req.user._id });
    if (!todo) return res.status(404).json({ error: 'Todo not found' });
    todo.completed = !todo.completed;
    await todo.save();
    res.json({ message: 'Todo toggled', todo });
  } catch (error) {
    res.status(500).json({ error: 'Error toggling todo' });
  }
});

// Delete todo
router.delete('/:id', async (req, res) => {
  try {
    const todo = await Todo.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!todo) return res.status(404).json({ error: 'Todo not found' });
    res.json({ message: 'Todo deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting todo' });
  }
});

module.exports = router;
