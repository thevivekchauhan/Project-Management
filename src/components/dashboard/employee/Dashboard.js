import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import {
  Box,
  Grid,
  Paper,
  Typography,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  AccessTime,
  DateRange,
} from '@mui/icons-material';

const Dashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { user } = useSelector((state) => state.auth);

  const [currentTime, setCurrentTime] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    setCalendarDays(generateCalendarDays(currentTime));
  }, [currentTime]);

  const formatTime = (date) => {
    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString([], {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });
  };

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  const generateCalendarDays = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    
    return days;
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
            Welcome, {user?.firstName || 'Employee'}!
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Here's your dashboard overview
          </Typography>
        </Box>

        {/* Clock and Calendar Section */}
        <Grid container spacing={2} sx={{ mb: 4 }}>
          {/* Premium Clock Design */}
          <Grid item xs={12} md={6}>
            <Paper
              elevation={0}
              sx={{
                p: 4,
                height: '100%',
                borderRadius: 4,
                border: '1px solid',
                borderColor: 'divider',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)',
                position: 'relative',
                overflow: 'hidden',
                '&:before': {
                  content: '""',
                  position: 'absolute',
                  top: -50,
                  right: -50,
                  width: 150,
                  height: 150,
                  borderRadius: '50%',
                  background: 'linear-gradient(45deg, rgba(25,118,210,0.1) 0%, rgba(25,118,210,0.2) 100%)',
                }
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  top: 16,
                  right: 16,
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <AccessTime sx={{ fontSize: 20, color: 'primary.main', mr: 1 }} />
                <Typography variant="body2" color="primary.main">
                  LIVE
                </Typography>
              </Box>
              
              <Typography variant="h5" color="text.secondary" sx={{ mb: 1 }}>
                {formatDate(currentTime)}
              </Typography>
              
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'baseline',
                  mb: 2,
                }}
              >
                <Typography 
                  variant="h1" 
                  sx={{ 
                    fontWeight: 'bold', 
                    fontSize: '4.5rem',
                    lineHeight: 1,
                    background: 'linear-gradient(45deg, #1976d2 0%, #115293 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  {formatTime(currentTime).split(':')[0]}
                </Typography>
                <Typography 
                  variant="h2" 
                  sx={{ 
                    fontWeight: 'bold', 
                    mx: 0.5,
                    color: 'text.secondary',
                  }}
                >
                  :
                </Typography>
                <Typography 
                  variant="h1" 
                  sx={{ 
                    fontWeight: 'bold', 
                    fontSize: '4.5rem',
                    lineHeight: 1,
                    background: 'linear-gradient(45deg, #1976d2 0%, #115293 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  {formatTime(currentTime).split(':')[1]}
                </Typography>
                <Typography 
                  variant="h3" 
                  sx={{ 
                    fontWeight: 'bold', 
                    ml: 1,
                    color: 'text.secondary',
                  }}
                >
                  {formatTime(currentTime).split(' ')[1]}
                </Typography>
              </Box>
              
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 'medium',
                  color: 'text.secondary',
                  letterSpacing: 2,
                  textTransform: 'uppercase',
                }}
              >
                {currentTime.toLocaleTimeString([], { second: '2-digit' })} seconds
              </Typography>
            </Paper>
          </Grid>
          
          {/* Premium Calendar Design */}
          <Grid item xs={12} md={6}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                height: '100%',
                borderRadius: 4,
                border: '1px solid',
                borderColor: 'divider',
                display: 'flex',
                flexDirection: 'column',
                background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <DateRange sx={{ 
                  fontSize: 30, 
                  color: 'primary.main', 
                  mr: 2,
                  background: 'linear-gradient(45deg, #1976d2 0%, #115293 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }} />
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                  {currentTime.toLocaleDateString([], { month: 'long', year: 'numeric' })}
                </Typography>
              </Box>
              
              {/* Day headers */}
              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(7, 1fr)',
                gap: 1,
                textAlign: 'center',
                mb: 2
              }}>
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
                  <Typography 
                    key={day} 
                    variant="body2" 
                    sx={{
                      fontWeight: 'bold',
                      color: index === 0 || index === 6 ? 'error.main' : 'text.secondary',
                      p: 1,
                    }}
                  >
                    {day}
                  </Typography>
                ))}
              </Box>
              
              {/* Calendar days */}
              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(7, 1fr)',
                gap: 1,
                textAlign: 'center'
              }}>
                {calendarDays.map((day, index) => {
                  if (day === null) {
                    return <Box key={`empty-${index}`} sx={{ p: 2 }} />;
                  }
                  
                  const dayOfWeek = new Date(
                    currentTime.getFullYear(),
                    currentTime.getMonth(),
                    day
                  ).getDay();
                  
                  const isToday = day === currentTime.getDate() && 
                                currentTime.getMonth() === new Date().getMonth() && 
                                currentTime.getFullYear() === new Date().getFullYear();
                  
                  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
                  
                  return (
                    <Box
                      key={`day-${day}`}
                      sx={{
                        p: 1.5,
                        borderRadius: '50%',
                        bgcolor: isToday ? 'primary.main' : 'transparent',
                        color: isToday ? 'common.white' : 
                              isWeekend ? 'error.main' : 'text.primary',
                        fontWeight: isToday ? 'bold' : 'medium',
                        cursor: 'pointer',
                        position: 'relative',
                        '&:hover': {
                          bgcolor: isToday ? 'primary.dark' : 'action.hover',
                        },
                        '&:after': isToday ? {
                          content: '""',
                          position: 'absolute',
                          bottom: 4,
                          left: '50%',
                          transform: 'translateX(-50%)',
                          width: 6,
                          height: 6,
                          borderRadius: '50%',
                          bgcolor: 'common.white',
                        } : {}
                      }}
                    >
                      {day}
                    </Box>
                  );
                })}
              </Box>
              
              {/* Calendar footer */}
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                mt: 'auto',
                pt: 2,
                borderTop: '1px solid',
                borderColor: 'divider'
              }}>
                <Typography variant="body2" color="text.secondary">
                  {currentTime.toLocaleDateString([], { weekday: 'long' })}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {currentTime.getDate()} {currentTime.toLocaleDateString([], { month: 'short' })}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </motion.div>
    </Box>
  );
};

export default Dashboard;

