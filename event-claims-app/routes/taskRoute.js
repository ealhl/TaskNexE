const express = require('express');
const router = express.Router();
const Task = require('../db/models/task');


// GET /api/tasks
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.getAllTasks();
    res.status(200).json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

//GET /api/tasks/:id
router.get('/:id', async (req, res) => {
  try {
    const taskId = req.params.id;
    const task = await Task.getTaskById(taskId);
    res.status(200).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

//GET /api/tasks/user/:id
router.get('/user/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const tasks = await Task.getTasksByUserId(userId);
    res.status(200).json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// POST /api/tasks/newTask
router.post('/newTask', async (req, res) => {
  try {
    const taskData = req.body;
    const newTask = await Task.createTask(taskData);
    res.status(201).json(newTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

// EDIT /api/tasks/:id
router.put('/:id', async (req, res) => {
  try {
    const taskId = req.params.id;
    const taskData = req.body;
    const updatedTask = await Task.updateTask(taskId, taskData);
    res.status(200).json(updatedTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// DELETE /api/tasks/:id
router.delete('/:id', async (req, res) => {
  try {
    const taskId = req.params.id;
    await Task.deleteTask(taskId);
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;