import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Card,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Button,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { Bell, Clock, Calendar, UserPlus, MessageSquare } from 'react-feather';

const NotificationsSummary = () => {
  const [notifications, setNotifications] = useState([]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    // Mock notifications data - in a real app, this would come from an API
    const mockNotifications = [
      {
        id: 1,
        type: 'overdue',
        title: 'Task "Update user authentication" is overdue',
        time: '2 days ago',
      },
      {
        id: 2,
        type: 'deadline',
        title: 'Project "Website Redesign" deadline in 3 days',
        time: '5 hours ago',
      },
      {
        id: 3,
        type: 'member',
        title: 'Sarah Vivekson joined Website Redesign team',
        time: '1 day ago',
      },
      {
        id: 4,
        type: 'comment',
        title: 'New comment on "Fix navigation menu bug"',
        time: 'Just now',
      },
    ];

    setNotifications(mockNotifications.slice(0, 3)); // Only show top 3 notifications
  }, []);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'overdue':
        return <Clock size={18} color="#e53e3e" />;
      case 'deadline':
        return <Calendar size={18} color="#dd6b20" />;
      case 'member':
        return <UserPlus size={18} color="#4299e1" />;
      case 'comment':
        return <MessageSquare size={18} color="#38a169" />;
      default:
        return <Bell size={18} color="#718096" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <Card
        component={motion.div}
        whileHover={{
          y: -5,
          boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
          transition: { duration: 0.2 },
        }}
        sx={{
          p: { xs: 1.5, sm: 2, md: 3 },
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          overflow: 'hidden',
          borderRadius: { xs: 1, sm: 2 },
          backgroundColor: '#ffffff',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '4px',
            background: 'linear-gradient(45deg, #4a6cf7 0%, #4a6cf799 100%)',
          },
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography
            variant={isMobile ? "subtitle1" : "h6"}
            sx={{
              fontSize: { xs: '1rem', sm: '1.1rem', md: '1.2rem' },
              fontWeight: 600,
              color: 'text.primary',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Bell size={18} style={{ marginRight: '8px' }} />
            Recent Notifications
          </Typography>
        </Box>

        <List sx={{ p: 0, mb: 2 }}>
          {notifications.map((notification, index) => (
            <Box key={notification.id}>
              <ListItem
                alignItems="flex-start"
                sx={{ 
                  py: 1,
                  px: 0,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    bgcolor: '#f7f9ff',
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: '40px' }}>
                  {getNotificationIcon(notification.type)}
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 500,
                        color: 'text.primary',
                        lineHeight: 1.3,
                        mb: 0.5,
                      }}
                    >
                      {notification.title}
                    </Typography>
                  }
                  secondary={
                    <Typography variant="caption" color="text.secondary">
                      {notification.time}
                    </Typography>
                  }
                />
              </ListItem>
              {index < notifications.length - 1 && (
                <Divider component="li" />
              )}
            </Box>
          ))}
        </List>

        <Box sx={{ mt: 'auto', textAlign: 'center' }}>
          <Button
            color="primary"
            sx={{
              fontWeight: 500,
              fontSize: '0.875rem',
              textTransform: 'none',
              '&:hover': {
                background: 'rgba(74, 108, 247, 0.08)',
              },
            }}
            onClick={() => {
              // This would navigate to notifications page or open the panel
              // For now, just log to console
              console.log('View all notifications');
            }}
          >
            View All Notifications
          </Button>
        </Box>
      </Card>
    </motion.div>
  );
};

export default NotificationsSummary; 