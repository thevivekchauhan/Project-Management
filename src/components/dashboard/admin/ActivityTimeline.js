import { motion } from 'framer-motion';
import {
  Box,
  Typography,
  Avatar,
  useTheme,
  useMediaQuery,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  IconButton,
  Tooltip,
  Card,
} from '@mui/material';
import {
  Task,
  AddCircle,
  CheckCircle,
  Edit,
  AccessTime,
} from '@mui/icons-material';

const activities = [
  {
    id: 1,
    user: 'Vivek',
    action: 'updated',
    target: 'UI Design Task',
    time: '2h ago',
    type: 'update',
    avatar: 'VC'
  },
  {
    id: 2,
    user: 'Vatudi',
    action: 'added',
    target: 'E-commerce Project',
    time: '4h ago',
    type: 'add',
    avatar: 'V'
  },
  {
    id: 3,
    user: 'Harsh',
    action: 'marked',
    target: 'Database Setup',
    time: '5h ago',
    type: 'complete',
    avatar: 'H'
  },
  {
    id: 4,
    user: 'Darshan',
    action: 'updated',
    target: 'API Integration',
    time: '6h ago',
    type: 'update',
    avatar: 'D'
  },
  {
    id: 5,
    user: 'Ishant',
    action: 'added',
    target: 'Mobile App Task',
    time: '8h ago',
    type: 'add',
    avatar: 'I'
  }
];

const ActivityTimeline = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const activityTypes = [
    { type: 'all', icon: <Task />, label: 'All Activities' },
    { type: 'update', icon: <Edit />, label: 'Updates' },
    { type: 'add', icon: <AddCircle />, label: 'Additions' },
    { type: 'complete', icon: <CheckCircle />, label: 'Completions' },
  ];

  const getActivityIcon = (type) => {
    switch (type) {
      case 'update':
        return <Edit sx={{ color: theme.palette.info.main, fontSize: '1rem' }} />;
      case 'add':
        return <AddCircle sx={{ color: theme.palette.success.main, fontSize: '1rem' }} />;
      case 'complete':
        return <CheckCircle sx={{ color: theme.palette.primary.main, fontSize: '1rem' }} />;
      default:
        return <Task sx={{ color: theme.palette.warning.main, fontSize: '1rem' }} />;
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'update':
        return theme.palette.info.main;
      case 'add':
        return theme.palette.success.main;
      case 'complete':
        return theme.palette.primary.main;
      default:
        return theme.palette.warning.main;
    }
  };

  return (
    <Card
      elevation={2}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        p: { xs: 2, sm: 3 },
        borderRadius: { xs: 1, sm: 2 },
        bgcolor: '#ffffff',
        boxShadow: '0 4px 20px 0 rgba(0,0,0,0.1)',
      }}
    >
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        mb: { xs: 2, sm: 3 },
        gap: 2,
        flexWrap: 'wrap'
      }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            color: '#1a237e',
            fontSize: { xs: '1.1rem', sm: '1.25rem' }
          }}
        >
          Recent Activities
        </Typography>
        <Box sx={{ 
          display: 'flex', 
          gap: 1,
          flexWrap: 'wrap',
          justifyContent: 'flex-end'
        }}>
          {activityTypes.map((activityType) => (
            <Tooltip key={activityType.type} title={activityType.label} placement="top">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <IconButton
                  size="small"
                  sx={{
                    p: { xs: 0.75, sm: 1 },
                    color: getActivityColor(activityType.type),
                    bgcolor: `${getActivityColor(activityType.type)}10`,
                    '&:hover': {
                      bgcolor: `${getActivityColor(activityType.type)}20`,
                    },
                  }}
                >
                  {activityType.icon}
                </IconButton>
              </motion.div>
            </Tooltip>
          ))}
        </Box>
      </Box>

      <List sx={{ 
        py: 0,
        height: '100%',
        overflow: 'auto',
        px: { xs: 0, sm: 1 },
        '&::-webkit-scrollbar': {
          width: '4px',
        },
        '&::-webkit-scrollbar-track': {
          background: '#f1f1f1',
          borderRadius: '4px',
        },
        '&::-webkit-scrollbar-thumb': {
          background: '#888',
          borderRadius: '4px',
        },
        '&::-webkit-scrollbar-thumb:hover': {
          background: '#555',
        },
      }}>
        {activities.map((activity, index) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <ListItem
              component={motion.div}
              whileHover={{
                backgroundColor: 'rgba(0,0,0,0.02)',
                scale: 1.02,
                transition: { duration: 0.2 }
              }}
              sx={{
                p: { xs: 1, sm: 1.5 },
                borderRadius: 1,
                mb: 1,
                cursor: 'pointer',
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  left: 0,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '3px',
                  height: '70%',
                  backgroundColor: (theme) => getActivityColor(activity.type),
                  borderRadius: '0 2px 2px 0',
                  opacity: 0.7,
                },
              }}
            >
              <ListItemAvatar sx={{ minWidth: { xs: 40, sm: 45 } }}>
                <Avatar
                  sx={{
                    bgcolor: (theme) => `${getActivityColor(activity.type)}15`,
                    color: (theme) => getActivityColor(activity.type),
                    width: { xs: 32, sm: 35 },
                    height: { xs: 32, sm: 35 },
                    fontSize: { xs: '0.8rem', sm: '0.9rem' },
                  }}
                >
                  {activity.avatar}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 500,
                      fontSize: { xs: '0.85rem', sm: '0.95rem' },
                      color: 'text.primary',
                      mb: 0.25,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      lineHeight: 1.4,
                    }}
                  >
                    <Box component="span" sx={{ fontWeight: 600 }}>{activity.user}</Box>
                    {' '}{activity.action}{' '}
                    <Box 
                      component="span" 
                      sx={{ 
                        color: getActivityColor(activity.type),
                        fontWeight: 500
                      }}
                    >
                      {activity.target}
                    </Box>
                  </Typography>
                }
                secondary={
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    gap: 1,
                    mt: 0.5
                  }}>
                    <Typography
                      variant="caption"
                      sx={{
                        fontSize: { xs: '0.7rem', sm: '0.75rem' },
                        color: 'text.secondary',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5
                      }}
                    >
                      <AccessTime sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }} />
                      {activity.time}
                    </Typography>
                    {getActivityIcon(activity.type)}
                  </Box>
                }
              />
            </ListItem>
          </motion.div>
        ))}
      </List>
    </Card>
  );
};

export default ActivityTimeline;