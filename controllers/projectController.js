const Project = require("../models/Project")
const Task = require("../models/Task")
const jwt = require('jsonwebtoken')

async function getAllProjects(req, res) {
  try {
    const userProjects = await Project.find({ user: req.user._id })

    res.json(userProjects)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: error.message })
  }
}

async function getProjectById(req, res) {
  try {
    const { projectId } = req.params
    const project = await Project.findById(projectId)

    if (!project) {
      return res
        .status(404)
        .json({ message: `Project with id: ${projectId} not found!` })
    }

    // Authorization
    console.log(req.user._id)
    console.log(project.user)
    
    if (project.user.toString() !== req.user._id) {
      return res.status(403).json({ message: "User is not authorized!" })
    }

    res.json(project)

  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'There was an error retrieving that project' })
  }
}

async function createProject(req, res) {
  try {
    const newProject = await Project.create({
      ...req.body,
      user: req.user._id,
    })

    res.status(201).json(newProject)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: error.message })
  }
}

async function updateProject(req, res) {
  //update a Project
  try {
    const { projectId } = req.params
    const project = await Project.findById(projectId)

    if (!project) {
      return res
        .status(404)
        .json({ message: `Project with id: ${projectId} not found!` });
    }
    await Project.findByIdAndUpdate(projectId, req.body, {new: true})
    await res.json(req.body)
  }
  catch (error) {
    console.error(error)
    res.status(500).json({ error: 'There was an error updating that project' })
  }
}

async function deleteProject(req, res) {
  //delete a project, and maybe all of its tasks
  try {
    const { projectId } = req.params
    const project = await Project.findById(projectId)

    if (!project) {
      return res
        .status(404)
        .json({ message: `Project with id: ${projectId} not found!` });
    }
    await Task.deleteMany({ project: projectId })
    await Project.findByIdAndDelete(projectId)
    await res.send("Project deleted successfully")
  }
  catch (error) {
    console.error(error)
    res.status(500).json({ error: 'There was an error deleting that project' })
  }
}

module.exports = {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
}