import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  IconButton,
  Badge,
  Menu,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Typography,
  Box,
  Divider,
  useTheme,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Assignment,
  Event,
  Message,
  Warning,
} from '@mui/icons-material';

const NotificationsPanel = () => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'task',
      title: 'New task assigned',
      message: 'You have been assigned to "Update user documentation"',
      time: '5 minutes ago',
      read: false,
    },
    {
      id: 2,
      type: 'event',
      title: 'Project deadline approaching',
      message: 'Website Redesign project deadline is in 3 days',
      time: '1 hour ago',
      read: false,
    },
    {
      id: 3,
      type: 'message',
      title: 'New comment on task',
      message: 'Vivek commented on "Implement new feature"',
      time: '2 hours ago',
      read: true,
    },
    {
      id: 4,
      type: 'warning',
      title: 'Task overdue',
      message: 'Bug fixes for login page is overdue',
      time: '1 day ago',
      read: true,
    },
  ]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationClick = (notificationId) => {
    setNotifications(notifications.map(notification =>
      notification.id === notificationId
        ? { ...notification, read: true }
        : notification
    ));
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'task':
        return <Assignment sx={{ color: theme.palette.primary.main }} />;
      case 'event':
        return <Event sx={{ color: theme.palette.warning.main }} />;
      case 'message':
        return <Message sx={{ color: theme.palette.info.main }} />;
      case 'warning':
        return <Warning sx={{ color: theme.palette.error.main }} />;
      default:
        return <NotificationsIcon />;
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <>
      <IconButton
        color="inherit"
        onClick={handleClick}
        sx={{
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
          },
        }}
      >
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          elevation: 3,
          sx: {
            width: 360,
            maxHeight: 480,
            mt: 1.5,
            '& .MuiMenuItem-root': {
              px: 2,
              py: 1.5,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box sx={{ p: 2, pb: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Notifications
          </Typography>
        </Box>
        <Divider />
        <List sx={{ p: 0 }}>
          <AnimatePresence>
            {notifications.map((notification) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <MenuItem
                  onClick={() => handleNotificationClick(notification.id)}
                  sx={{
                    backgroundColor: notification.read ? 'transparent' : 'action.hover',
                    '&:hover': {
                      backgroundColor: 'action.selected',
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    {getNotificationIcon(notification.type)}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography
                        variant="subtitle2"
                        sx={{
                          fontWeight: notification.read ? 'normal' : 'bold',
                        }}
                      >
                        {notification.title}
                      </Typography>
                    }
                    secondary={
                      <Box>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            mb: 0.5,
                            fontWeight: notification.read ? 'normal' : 'medium',
                          }}
                        >
                          {notification.message}
                        </Typography>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ display: 'block' }}
                        >
                          {notification.time}
                        </Typography>
                      </Box>
                    }
                  />
                </MenuItem>
              </motion.div>
            ))}
          </AnimatePresence>
        </List>
      </Menu>
    </>
  );
};

export default NotificationsPanel; 