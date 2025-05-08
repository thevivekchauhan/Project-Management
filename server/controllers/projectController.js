const Project = require('../models/projectModel');
const { logActivity } = require('./activityController');

exports.createProject = async (req, res) => {
  try {
    const project = new Project({
      ...req.body,
      manager: req.user.id,
      companyId: req.user.companyId || req.user._id
    });

    await project.save();

    // Log activity
    await logActivity(
      req,
      req.user,
      'create',
      'project',
      project._id,
      `Created new project: ${project.name}`,
      { after: req.body }
    );

    res.status(201).json({
      success: true,
      data: project
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating project',
      error: error.message
    });
  }
};

exports.updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Store previous values for activity log
    const previousValues = project.toObject();

    // Update project
    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    // Log activity with detailed changes
    const changes = {
      before: previousValues,
      after: req.body
    };

    await logActivity(
      req,
      req.user,
      'update',
      'project',
      project._id,
      `Updated project: ${project.name}`,
      changes
    );

    res.json({
      success: true,
      data: updatedProject
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating project',
      error: error.message
    });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Store project data before deletion for activity log
    const projectData = project.toObject();

    await project.remove();

    // Log activity
    await logActivity(
      req,
      req.user,
      'delete',
      'project',
      project._id,
      `Deleted project: ${project.name}`,
      { before: projectData }
    );

    res.json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting project',
      error: error.message
    });
  }
};

exports.addTeamMember = async (req, res) => {
  try {
    const { projectId, userId } = req.params;
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    if (project.members.includes(userId)) {
      return res.status(400).json({
        success: false,
        message: 'User is already a team member'
      });
    }

    project.members.push(userId);
    await project.save();

    // Log activity
    await logActivity(
      req,
      req.user,
      'update',
      'project',
      project._id,
      `Added team member to project: ${project.name}`,
      { 
        action: 'add_member',
        memberId: userId 
      }
    );

    res.json({
      success: true,
      data: project
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding team member',
      error: error.message
    });
  }
};