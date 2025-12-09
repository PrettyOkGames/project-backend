const Task = require("../models/Task")
const jwt = require('jsonwebtoken')

async function getAllTasks(req, res) {
  try {
    const projectTasks = await Task.find({ project: req.project._id })

    res.json(projectTasks)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: error.message })
  }
}

async function getTaskById(req, res) {
  try {
    const { taskId } = req.params
    const task = await Task.findById(taskId)

    if (!task) {
      return res
        .status(404)
        .json({ message: `Task with id: ${taskId} not found!` })
    }

    // Authorization   
    if (task.project.user.toString() !== req.project.user._id) {
      return res.status(403).json({ message: "User is not authorized!" })
    }

    res.json(task)

  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'There was an error retrieving that task' })
  }
}

async function createTask(req, res) {
  try {
    const newTask = await Task.create({
      ...req.body,
      project: req.project._id,
    })

    res.status(201).json(newTask)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: error.message })
  }
}

async function updateTask(req, res) {
  //update a Project
  try {
    const { taskId } = req.params
    const task = await Task.findById(taskId)

    if (!task) {
      return res
        .status(404)
        .json({ message: `Task with id: ${taskId} not found!` });
    }
    await Task.findByIdAndUpdate(taskId, req.body, {new: true})
    await res.json(req.body)
  }
  catch (error) {
    console.error(error)
    res.status(500).json({ error: 'There was an error updating that task' })
  }
}

async function deleteTask(req, res) {
  //delete a specific task
  try {
    const { taskId } = req.params
    const task = await Task.findById(taskId)

    if (!task) {
      return res
        .status(404)
        .json({ message: `Task with id: ${taskId} not found!` });
    }
    await Task.findByIdAndDelete(taskId)
    await res.send("Task deleted successfully")
  }
  catch (error) {
    console.error(error)
    res.status(500).json({ error: 'There was an error deleting that task' })
  }
}

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
}