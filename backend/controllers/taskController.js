const Task = require('../models/Task');

// @route   GET /api/tasks (Protected)
const getTasks = async (req, res) => {
    const tasks = await Task.find({ user: req.user._id });
    res.json(tasks);
};

// @route   POST /api/tasks (Protected)
const createTask = async (req, res) => {
    const { title, description } = req.body;
    const task = await Task.create({ title, description, user: req.user._id });
    res.status(201).json(task);
};

// @route   PUT /api/tasks/:id (Protected)
const updateTask = async (req, res) => {
    const task = await Task.findById(req.params.id);
    if (task.user.toString() !== req.user._id.toString()) return res.status(401).json({ message: 'Not authorized' });
    const updated = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
};

// @route   DELETE /api/tasks/:id (Protected)
const deleteTask = async (req, res) => {
    const task = await Task.findById(req.params.id);
    if (task.user.toString() !== req.user._id.toString()) return res.status(401).json({ message: 'Not authorized' });
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task removed' });
};

module.exports = { getTasks, createTask, updateTask, deleteTask };