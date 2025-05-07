import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Stack,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  useTheme,
  LinearProgress,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit,
  Delete,
  Visibility,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { projectApi } from '../../../services/api';

const ProjectsSection = () => {
  const [projects, setProjects] = useState([]);
  const [editProject, setEditProject] = useState(null);
  const [deleteProject, setDeleteProject] = useState(null);
  const [openNewProject, setOpenNewProject] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [newProject, setNewProject] = useState({
    name: '',
    startDate: new Date(),
    endDate: new Date(),
    description: '',
    progress: 0,
    status: 'Active'
  });
  
  const theme = useTheme();
  const navigate = useNavigate();

  // Fetch projects when component mounts
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await projectApi.getAllProjects();
      console.log('Fetched projects:', response);
      if (response.success && response.projects) {
        setProjects(response.projects);
      } else if (Array.isArray(response)) {
        // Handle case where response is direct array of projects
        setProjects(response);
      } else {
        setProjects([]);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
      setSnackbar({
        open: true,
        message: 'Failed to fetch projects',
        severity: 'error'
      });
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEditProject = (project) => {
    setEditProject(project);
  };

  const handleDeleteProject = (project) => {
    setDeleteProject(project);
  };

  const handleConfirmDelete = async () => {
    try {
      setLoading(true);
      await projectApi.deleteProject(deleteProject._id);
      await fetchProjects();
      setDeleteProject(null);
      setSnackbar({
        open: true,
        message: 'Project deleted successfully',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error deleting project:', error);
      setSnackbar({
        open: true,
        message: 'Failed to delete project',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveEdit = async () => {
    try {
      setLoading(true);
      await projectApi.updateProject(editProject._id, editProject);
      await fetchProjects();
      setEditProject(null);
      setSnackbar({
        open: true,
        message: 'Project updated successfully',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error updating project:', error);
      setSnackbar({
        open: true,
        message: 'Failed to update project',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleNewProject = () => {
    setOpenNewProject(true);
  };

  const handleSaveNewProject = async () => {
    try {
      setLoading(true);
      const response = await projectApi.createProject(newProject);
      console.log('Create project response:', response);
      
      if (response && (response.project || response.success)) {
        // Add the new project to the projects array
        const createdProject = response.project || response;
        setProjects(prevProjects => [createdProject, ...prevProjects]);
        
        setOpenNewProject(false);
        setNewProject({
          name: '',
          startDate: new Date(),
          endDate: new Date(),
          description: '',
          progress: 0,
          status: 'Active'
        });
        setSnackbar({
          open: true,
          message: 'Project created successfully',
          severity: 'success'
        });
      }
    } catch (error) {
      console.error('Error creating project:', error);
      setSnackbar({
        open: true,
        message: error.message || 'Failed to create project',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box id="projects" sx={{ mt: 6, scrollMarginTop: '64px' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 600, color: '#1a237e' }}>
          Latest Projects
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleNewProject}
          sx={{
            background: 'linear-gradient(45deg, #4CAF50 30%, #81C784 90%)',
            boxShadow: '0 3px 5px 2px rgba(76, 175, 80, .3)',
          }}
        >
          New Project
        </Button>
      </Box>

      {loading && <LinearProgress sx={{ mb: 2 }} />}

      <TableContainer
        component={Paper}
        sx={{
          boxShadow: '0 4px 20px 0 rgba(0,0,0,0.1)',
          borderRadius: 2,
          overflow: 'hidden',
        }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f7fb' }}>
              <TableCell sx={{ fontWeight: 600 }}>Project Name</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Progress</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Start Date</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>End Date</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {projects.map((project) => (
              <TableRow
                key={project._id}
                sx={{
                  '&:hover': {
                    backgroundColor: '#f8f9fa',
                  },
                }}
              >
                <TableCell>{project.name}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LinearProgress
                      variant="determinate"
                      value={project.progress}
                      sx={{
                        width: 100,
                        height: 8,
                        borderRadius: 5,
                        backgroundColor: '#e0e0e0',
                        '& .MuiLinearProgress-bar': {
                          borderRadius: 5,
                          backgroundColor: 
                            project.progress === 100 
                              ? '#4caf50' 
                              : project.progress > 50 
                              ? '#2196f3' 
                              : '#ff9800',
                        },
                      }}
                    />
                    <Typography variant="body2">
                      {project.progress}%
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>{format(new Date(project.startDate), 'MMM dd, yyyy')}</TableCell>
                <TableCell>{format(new Date(project.endDate), 'MMM dd, yyyy')}</TableCell>
                <TableCell>
                  <Chip
                    label={project.status}
                    color={project.status === 'Active' ? 'primary' : 'success'}
                    size="small"
                    sx={{
                      fontWeight: 500,
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    <Tooltip title="View Details">
                      <IconButton
                        size="small"
                        onClick={() => navigate(`/admin/projects/${project._id}`)}
                        sx={{ color: theme.palette.info.main }}
                      >
                        <Visibility fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit Project">
                      <IconButton
                        size="small"
                        onClick={() => handleEditProject(project)}
                        sx={{ color: theme.palette.warning.main }}
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Project">
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteProject(project)}
                        sx={{ color: theme.palette.error.main }}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Edit Project Dialog */}
      <Dialog open={!!editProject} onClose={() => setEditProject(null)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Project</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Project Name"
              value={editProject?.name || ''}
              onChange={(e) => setEditProject({ ...editProject, name: e.target.value })}
            />
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Start Date"
                value={editProject?.startDate || null}
                onChange={(date) => setEditProject({ ...editProject, startDate: date })}
              />
              <DatePicker
                label="End Date"
                value={editProject?.endDate || null}
                onChange={(date) => setEditProject({ ...editProject, endDate: date })}
              />
            </LocalizationProvider>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Description"
              value={editProject?.description || ''}
              onChange={(e) => setEditProject({ ...editProject, description: e.target.value })}
            />
            <TextField
              fullWidth
              type="number"
              label="Progress"
              value={editProject?.progress || 0}
              onChange={(e) => setEditProject({ ...editProject, progress: Number(e.target.value) })}
              inputProps={{ min: 0, max: 100 }}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditProject(null)}>Cancel</Button>
          <Button onClick={handleSaveEdit} variant="contained">Save Changes</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteProject} onClose={() => setDeleteProject(null)}>
        <DialogTitle>Delete Project</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{deleteProject?.name}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteProject(null)}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* New Project Dialog */}
      <Dialog open={openNewProject} onClose={() => setOpenNewProject(false)} maxWidth="sm" fullWidth>
        <DialogTitle>New Project</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Project Name"
              value={newProject.name}
              onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
            />
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Start Date"
                value={newProject.startDate}
                onChange={(date) => setNewProject({ ...newProject, startDate: date })}
              />
              <DatePicker
                label="End Date"
                value={newProject.endDate}
                onChange={(date) => setNewProject({ ...newProject, endDate: date })}
              />
            </LocalizationProvider>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Description"
              value={newProject.description}
              onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
            />
            <TextField
              fullWidth
              type="number"
              label="Progress"
              value={newProject.progress}
              onChange={(e) => setNewProject({ ...newProject, progress: Number(e.target.value) })}
              inputProps={{ min: 0, max: 100 }}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenNewProject(false)}>Cancel</Button>
          <Button onClick={handleSaveNewProject} variant="contained">Create Project</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProjectsSection;