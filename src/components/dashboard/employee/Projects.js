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
  Grid,
  useMediaQuery,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit,
  Delete,
  Visibility,
  CalendarToday,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { projectApi } from '../../../services/api';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [viewMode, setViewMode] = useState('card'); // 'card' or 'table'
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [editProject, setEditProject] = useState(null);
  
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  // Fetch projects when component mounts
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await projectApi.getAllProjects();
      console.log('Fetched projects:', response);
      
      // Handle different response formats
      if (response) {
        if (response.success && response.projects) {
          setProjects(response.projects);
        } else if (Array.isArray(response)) {
          // Handle case where response is direct array of projects
          setProjects(response);
        } else if (response.data && Array.isArray(response.data)) {
          // Handle case where projects are in data property
          setProjects(response.data);
        } else {
          // Default to empty array if no recognizable format
          console.warn('Unexpected projects response format:', response);
          setProjects([]);
        }
      } else {
        setProjects([]);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
      
      // Extract error message from various error formats
      const errorMessage = error.response?.data?.message || 
                           error.message || 
                          'Network error occurred. Please try again.';
                          
      setSnackbar({
        open: true,
        message: `Failed to fetch projects: ${errorMessage}`,
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

  const handleSaveEdit = async () => {
    try {
      setLoading(true);
      await projectApi.updateProject(editProject._id, editProject);
      
      // Update the local state to reflect changes immediately
      setProjects(projects.map(project => 
        project._id === editProject._id ? editProject : project
      ));
      
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

  const ProjectCard = ({ project }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Paper
        elevation={0}
        sx={{
          p: 3,
          height: '100%',
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'divider',
          '&:hover': {
            boxShadow: 2,
          },
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
              {project.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {project.description}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <CalendarToday sx={{ fontSize: 16, color: 'text.secondary', mr: 1 }} />
            <Typography variant="body2" color="text.secondary">
              Start: {format(new Date(project.startDate), 'MMM dd, yyyy')}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <CalendarToday sx={{ fontSize: 16, color: 'text.secondary', mr: 1 }} />
            <Typography variant="body2" color="text.secondary">
              Due: {format(new Date(project.endDate), 'MMM dd, yyyy')}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Progress
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {project.progress}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={project.progress}
            sx={{
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
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Chip
            label={project.status}
            color={project.status === 'Completed' ? 'success' : 'primary'}
            size="small"
            sx={{
              fontWeight: 500,
            }}
          />
          <Box>
            <Button
              size="small"
              endIcon={<Edit />}
              onClick={() => handleEditProject(project)}
              color="secondary"
            >
              Edit
            </Button>
          </Box>
        </Box>
      </Paper>
    </motion.div>
  );

  const renderCardView = () => (
    <Grid container spacing={3}>
      {projects.map((project) => (
        <Grid item xs={12} md={6} lg={4} key={project._id}>
          <ProjectCard project={project} />
        </Grid>
      ))}
    </Grid>
  );

  const renderTableView = () => (
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
                  color={project.status === 'Completed' ? 'success' : 'primary'}
                  size="small"
                  sx={{
                    fontWeight: 500,
                  }}
                />
              </TableCell>
              <TableCell>
                <Stack direction="row" spacing={1}>
                  <Tooltip title="Edit Project">
                    <IconButton
                      size="small"
                      onClick={() => handleEditProject(project)}
                      sx={{ color: theme.palette.warning.main }}
                    >
                      <Edit fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <Box sx={{ p: isMobile ? 1 : 3 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
              My Projects
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Track and manage your assigned projects
            </Typography>
          </Box>
          <Box>
            <Button
              variant={viewMode === 'card' ? 'contained' : 'outlined'}
              onClick={() => setViewMode('card')}
              sx={{ mr: 1, borderRadius: 2 }}
            >
              Card View
            </Button>
            <Button
              variant={viewMode === 'table' ? 'contained' : 'outlined'}
              onClick={() => setViewMode('table')}
              sx={{ borderRadius: 2 }}
            >
              Table View
            </Button>
          </Box>
        </Box>

        {loading && <LinearProgress sx={{ mb: 2 }} />}

        {viewMode === 'card' ? renderCardView() : renderTableView()}
      </motion.div>

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
            <TextField
              select
              fullWidth
              label="Status"
              value={editProject?.status || 'Active'}
              onChange={(e) => setEditProject({ ...editProject, status: e.target.value })}
              SelectProps={{
                native: true,
              }}
            >
              <option value="Active">Active</option>
              <option value="Completed">Completed</option>
            </TextField>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditProject(null)}>Cancel</Button>
          <Button onClick={handleSaveEdit} variant="contained">Save Changes</Button>
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

export default Projects; 