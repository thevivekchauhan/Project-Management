import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  IconButton,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  useTheme,
  useMediaQuery,
  Divider,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  Assignment,
  Comment,
  CheckCircle,
  Pending,
  Warning,
  Edit,
  Delete,
} from '@mui/icons-material';
import { taskApi } from '../../../services/api';

const Tasks = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [commentDialogOpen, setCommentDialogOpen] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await taskApi.getAllTasks();
      if (response.success && response.tasks) {
        setTasks(response.tasks);
      } else if (Array.isArray(response)) {
        setTasks(response);
      } else {
        setTasks([]);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setSnackbar({
        open: true,
        message: 'Failed to fetch tasks',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Done':
      case 'completed':
        return 'success';
      case 'In Progress':
      case 'pending':
        return 'warning';
      case 'To Do':
      case 'overdue':
        return 'error';
      default:
        return 'default';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'success';
      default:
        return 'default';
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      setLoading(true);
      await taskApi.updateTask(taskId, { status: newStatus });
      await fetchTasks();
      setSnackbar({
        open: true,
        message: 'Task status updated successfully',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error updating task status:', error);
      setSnackbar({
        open: true,
        message: 'Failed to update task status',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async () => {
    if (newComment.trim() && selectedTask) {
      try {
        setLoading(true);
        const updatedComments = [
          ...(selectedTask.comments || []),
          {
            text: newComment,
            date: new Date().toISOString(),
          }
        ];
        await taskApi.updateTask(selectedTask._id, { comments: updatedComments });
        await fetchTasks();
        setNewComment('');
        setCommentDialogOpen(false);
        setSnackbar({
          open: true,
          message: 'Comment added successfully',
          severity: 'success'
        });
      } catch (error) {
        console.error('Error adding comment:', error);
        setSnackbar({
          open: true,
          message: 'Failed to add comment',
          severity: 'error'
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const TaskItem = ({ task }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Paper
        elevation={2}
        sx={{
          mb: 2,
          p: 2,
          borderRadius: 2,
          '&:hover': {
            boxShadow: 4,
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <ListItemIcon>
            <Assignment />
          </ListItemIcon>
          <ListItemText
            primary={
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                {task.title}
              </Typography>
            }
            secondary={`Project: ${task.project} • Due: ${new Date(task.dueDate).toLocaleDateString()}`}
          />
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Chip
              label={task.status}
              color={getStatusColor(task.status)}
              size="small"
            />
            <Chip
              label={task.priority}
              color={getPriorityColor(task.priority)}
              size="small"
            />
          </Box>
        </Box>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {task.description}
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              size="small"
              variant="outlined"
              onClick={() => {
                setSelectedTask(task);
                setCommentDialogOpen(true);
              }}
              startIcon={<Comment />}
            >
              Comments ({task.comments?.length || 0})
            </Button>
            <Button
              size="small"
              variant="outlined"
              color="primary"
              onClick={() => handleStatusChange(task._id, 'Done')}
              startIcon={<CheckCircle />}
            >
              Mark Complete
            </Button>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton size="small" color="primary">
              <Edit />
            </IconButton>
            <IconButton size="small" color="error">
              <Delete />
            </IconButton>
          </Box>
        </Box>
      </Paper>
    </motion.div>
  );

  return (
    <Box sx={{ p: isMobile ? 1 : 3 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>
          My Tasks
        </Typography>

        <List>
          {tasks.map((task) => (
            <TaskItem key={task._id} task={task} />
          ))}
        </List>

        <Dialog
          open={commentDialogOpen}
          onClose={() => setCommentDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            Comments - {selectedTask?.title}
          </DialogTitle>
          <DialogContent>
            <List>
              {selectedTask?.comments?.map((comment, index) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={comment.text}
                    secondary={new Date(comment.date).toLocaleString()}
                  />
                </ListItem>
              ))}
            </List>
            <Divider sx={{ my: 2 }} />
            <TextField
              fullWidth
              multiline
              rows={3}
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setCommentDialogOpen(false)}>Cancel</Button>
            <Button
              onClick={handleAddComment}
              variant="contained"
              color="primary"
            >
              Add Comment
            </Button>
          </DialogActions>
        </Dialog>

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
      </motion.div>
    </Box>
  );
};

export default Tasks;