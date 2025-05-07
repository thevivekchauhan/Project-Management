import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Box,
  Grid,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  IconButton,
  useTheme,
  useMediaQuery,
  LinearProgress,
  Avatar,
  AvatarGroup,
  Button,
} from '@mui/material';
import {
  Assignment,
  CheckCircle,
  Pending,
  Warning,
  Comment,
  Add as AddIcon,
  TrendingUp,
  CalendarToday,
  Group,
  ArrowForward,
  Message,
} from '@mui/icons-material';

const Dashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [stats] = useState({
    tasks: {
      total: 24,
      completed: 18,
      inProgress: 4,
      pending: 2,
    },
    projects: {
      active: 3,
      completed: 5,
      upcoming: 2,
    },
    messages: {
      unread: 5,
      total: 28,
    },
  });

  const [recentTasks, setRecentTasks] = useState([
    {
      id: 1,
      title: 'Update user documentation',
      status: 'completed',
      deadline: '2024-05-01',
      project: 'Website Redesign',
      progress: 100,
    },
    {
      id: 2,
      title: 'Implement new feature',
      status: 'pending',
      deadline: '2024-05-05',
      project: 'Mobile App',
      progress: 60,
    },
    {
      id: 3,
      title: 'Bug fixes for login page',
      status: 'overdue',
      deadline: '2024-04-28',
      project: 'Website Redesign',
      progress: 30,
    },
  ]);

  const StatCard = ({ title, value, icon, color }) => (
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
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: `${color}15`,
            color: color,
            mr: 2,
          }}
        >
          {icon}
        </Box>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            {value}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {title}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );

  const TaskItem = ({ task }) => {
    const getStatusColor = (status) => {
      switch (status) {
        case 'completed':
          return 'success';
        case 'pending':
          return 'warning';
        case 'overdue':
          return 'error';
        default:
          return 'default';
      }
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Paper
          elevation={0}
          sx={{
            mb: 2,
            p: 2,
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider',
            '&:hover': {
              boxShadow: 2,
            },
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar
              sx={{
                width: 40,
                height: 40,
                bgcolor: `${theme.palette.primary.main}15`,
                color: 'primary.main',
                mr: 2,
              }}
            >
              <Assignment />
            </Avatar>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                {task.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {task.project}
              </Typography>
            </Box>
            <Chip
              label={task.status}
              color={getStatusColor(task.status)}
              size="small"
              sx={{ ml: 2 }}
            />
          </Box>
          
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <CalendarToday sx={{ fontSize: 16, color: 'text.secondary', mr: 1 }} />
              <Typography variant="body2" color="text.secondary">
                Due: {task.deadline}
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={task.progress}
              sx={{
                height: 6,
                borderRadius: 3,
                bgcolor: `${theme.palette.primary.main}15`,
                '& .MuiLinearProgress-bar': {
                  borderRadius: 3,
                },
              }}
            />
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Button
              size="small"
              startIcon={<Comment />}
              sx={{ color: 'text.secondary' }}
            >
              Add Comment
            </Button>
            <Button
              size="small"
              endIcon={<ArrowForward />}
              color="primary"
            >
              View Details
            </Button>
          </Box>
        </Paper>
      </motion.div>
    );
  };

  return (
    <Box sx={{ p: isMobile ? 1 : 3 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
            Welcome back, Vivek!
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Here's what's happening with your projects today.
          </Typography>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total Tasks"
              value={stats.tasks.total}
              icon={<Assignment />}
              color={theme.palette.primary.main}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Active Projects"
              value={stats.projects.active}
              icon={<TrendingUp />}
              color={theme.palette.success.main}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Upcoming Events"
              value={stats.projects.upcoming}
              icon={<CalendarToday />}
              color={theme.palette.warning.main}
            />
          </Grid>
          {/* <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Unread Messages"
              value={stats.messages.unread}
              icon={<Message />}
              color={theme.palette.error.main}
            />
          </Grid> */}

          <Grid item xs={12} md={8}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
                Task Progress
              </Typography>
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Completed Tasks
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {stats.tasks.completed}/{stats.tasks.total}
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={(stats.tasks.completed / stats.tasks.total) * 100}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    bgcolor: `${theme.palette.primary.main}15`,
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 4,
                    },
                  }}
                />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Progress
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    {stats.tasks.inProgress}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Pending
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    {stats.tasks.pending}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Completed
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    {stats.tasks.completed}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
                height: '100%',
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
                Team Members
              </Typography>
              <AvatarGroup
                max={4}
                sx={{
                  '& .MuiAvatar-root': {
                    width: 40,
                    height: 40,
                    fontSize: '1rem',
                  },
                }}
              >
                <Avatar sx={{ bgcolor: theme.palette.primary.main }}>JD</Avatar>
                <Avatar sx={{ bgcolor: theme.palette.success.main }}>AB</Avatar>
                <Avatar sx={{ bgcolor: theme.palette.warning.main }}>CD</Avatar>
                <Avatar sx={{ bgcolor: theme.palette.error.main }}>EF</Avatar>
                <Avatar sx={{ bgcolor: theme.palette.info.main }}>GH</Avatar>
              </AvatarGroup>
              <Button
                variant="outlined"
                fullWidth
                sx={{ mt: 3 }}
              >
                View All Members
              </Button>
            </Paper>
          </Grid>
        </Grid>
        <br></br>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={8}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Recent Tasks
                </Typography>
                <Button
                  endIcon={<ArrowForward />}
                  sx={{ color: 'primary.main' }}
                >
                  View All
                </Button>
              </Box>
              <List sx={{ p: 0 }}>
                {recentTasks.map((task) => (
                  <TaskItem key={task.id} task={task} />
                ))}
              </List>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
                height: '100%',
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
                Team Activity
              </Typography>
              <List sx={{ p: 0 }}>
                {[1, 2, 3].map((item) => (
                  <ListItem
                    key={item}
                    sx={{
                      px: 0,
                      py: 1.5,
                      borderBottom: '1px solid',
                      borderColor: 'divider',
                      '&:last-child': {
                        borderBottom: 'none',
                      },
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        mr: 2,
                        bgcolor: theme.palette.primary.main,
                      }}
                    >
                      {String.fromCharCode(64 + item)}
                    </Avatar>
                    <ListItemText
                      primary={
                        <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                          Team member {item} completed a task
                        </Typography>
                      }
                      secondary={
                        <Typography variant="caption" color="text.secondary">
                          2 hours ago
                        </Typography>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>
        </Grid>
      </motion.div>
    </Box>
  );
};

export default Dashboard; 