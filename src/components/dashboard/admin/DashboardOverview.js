import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Box,
  Grid,
  Card,
  Typography,
  LinearProgress,
  useTheme,
  useMediaQuery,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  Groups,
  CheckCircle,
  Pending,
  TrendingUp,
  TrendingDown,
} from '@mui/icons-material';
import { recentTaskApi } from '../../../services/api';

const DashboardOverview = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [metrics, setMetrics] = useState({
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    progress: 0
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await recentTaskApi.getAllRecentTasks();
      if (response.success && response.tasks) {
        setTasks(response.tasks);
        calculateMetrics(response.tasks);
      }
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError('Failed to load tasks data');
    } finally {
      setLoading(false);
    }
  };

  const calculateMetrics = (tasks) => {
    const total = tasks.length;
    const completed = tasks.filter(task => task.status === 'Done').length;
    const pending = tasks.filter(task => task.status === 'To Do').length;
    const progress = total > 0 ? (completed / total) * 100 : 0;

    setMetrics({
      totalTasks: total,
      completedTasks: completed,
      pendingTasks: pending,
      progress: progress
    });
  };

  const statCards = [
    {
      title: 'Active Team Members',
      count: metrics.totalTasks,
      icon: <Groups />,
      color: '#4caf50',
      trend: '+15%',
      trendUp: true,
      description: '4 new members joined',
      progress: metrics.progress,
    },
    {
      title: 'Completed Projects',
      count: metrics.completedTasks,
      icon: <CheckCircle />,
      color: '#9c27b0',
      trend: '75%',
      trendUp: true,
      description: 'Project completion rate',
      progress: 75,
    },
    {
      title: 'Pending Tasks',
      count: metrics.pendingTasks,
      icon: <Pending />,
      color: '#f44336',
      trend: '-5%',
      trendUp: false,
      description: 'Tasks need attention',
      progress: 40,
    },
  ];

  if (loading) {
    return <LinearProgress />;
  }

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      <Grid container spacing={3}>
        {statCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card
                sx={{
                  p: 3,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 2,
                  boxShadow: '0 4px 20px 0 rgba(0,0,0,0.1)',
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: `${card.color}15`,
                      color: card.color,
                    }}
                  >
                    {card.icon}
                  </Box>
                  <Typography
                    variant="body2"
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      color: card.trendUp ? 'success.main' : 'error.main',
                      fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    }}
                  >
                    {card.trendUp ? (
                      <TrendingUp fontSize="small" sx={{ mr: 0.5 }} />
                    ) : (
                      <TrendingDown fontSize="small" sx={{ mr: 0.5 }} />
                    )}
                    {card.trend}
                  </Typography>
                </Box>

                <Box sx={{ flexGrow: 1 }}>
                  <Typography
                    variant="h4"
                    sx={{
                      mb: 1,
                      fontWeight: 600,
                      fontSize: { xs: '1.5rem', sm: '2rem' },
                    }}
                  >
                    {card.count}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      mb: 2,
                      color: 'text.secondary',
                      fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    }}
                  >
                    {card.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ 
                      color: 'text.secondary',
                      fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.875rem' }
                    }}
                  >
                    {card.description}
                  </Typography>
                </Box>

                <Box sx={{ mt: 2 }}>
                  <LinearProgress
                    variant="determinate"
                    value={card.progress}
                    sx={{
                      height: { xs: 4, sm: 6, md: 8 },
                      borderRadius: 5,
                      bgcolor: `${card.color}20`,
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 5,
                        bgcolor: card.color,
                      },
                    }}
                  />
                </Box>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      <Snackbar 
        open={!!error} 
        autoHideDuration={6000} 
        onClose={() => setError(null)}
      >
        <Alert 
          onClose={() => setError(null)} 
          severity="error" 
          sx={{ width: '100%' }}
        >
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default DashboardOverview;