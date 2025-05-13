import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  IconButton,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Badge,
  Divider,
  useTheme,
  useMediaQuery,
  Button,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  Send as SendIcon,
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
  AttachFile as AttachFileIcon,
  EmojiEmotions as EmojiIcon,
} from '@mui/icons-material';
import { userApi, chatApi } from '../../../services/api.js';
import { useSelector } from 'react-redux';

const MessagesSection = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const { user } = useSelector((state) => state.auth);

  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState('');
  const [employees, setEmployees] = useState([]);
  const [messages, setMessages] = useState({});
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    console.log('Current user:', user); // Debug log
    if (!user) {
      setNotification({
        open: true,
        message: 'Please log in to continue',
        severity: 'error'
      });
      return;
    }
    fetchEmployees();
    if (selectedChat) {
      fetchMessages(selectedChat.id);
    }
  }, [selectedChat, user]);

  const fetchMessages = async (userId) => {
    try {
      const response = await chatApi.getMessagesByUser(userId);
      if (response.success && response.data) {
        const formattedMessages = response.data.map(msg => ({
          id: msg._id,
          sender: msg.sender._id === user._id ? 'You' : msg.sender.name,
          avatar: msg.sender._id === user._id ? user.name.charAt(0) : msg.sender.name.charAt(0),
          message: msg.content,
          time: new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isOwn: msg.sender._id === user._id,
        }));
        
        setMessages(prev => ({
          ...prev,
          [userId]: formattedMessages
        }));
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      setNotification({
        open: true,
        message: 'Failed to fetch messages',
        severity: 'error'
      });
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await userApi.getAllUsers();
      if (response.success && response.users) {
        const employeeList = response.users
          .filter(user => user.role === 'employee')
          .map(user => ({
            id: user._id,
            name: user.name,
            avatar: user.name.charAt(0),
            role: user.role,
            lastMessage: '',
            time: '',
            unread: 0,
            online: true,
          }));
        setEmployees(employeeList);
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
      setNotification({
        open: true,
        message: 'Failed to fetch employees',
        severity: 'error'
      });
    }
  };

  const handleSendMessage = async () => {
    // Debug log for user state
    console.log('Current user state:', user);

    if (!user || !user.id) {
      console.error('User not authenticated or missing ID:', user);
      setNotification({
        open: true,
        message: 'Please log in to continue',
        severity: 'error'
      });
      return;
    }

    if (!selectedChat || !selectedChat.id) {
      console.error('No chat selected or missing chat ID:', selectedChat);
      setNotification({
        open: true,
        message: 'Please select a chat to send message',
        severity: 'error'
      });
      return;
    }

    if (!message.trim()) {
      setNotification({
        open: true,
        message: 'Message cannot be empty',
        severity: 'error'
      });
      return;
    }

    try {
      const messageData = {
        sender: user.id,
        receiver: selectedChat.id,
        content: message.trim()
      };

      // Debug log for message data
      console.log('Preparing to send message with data:', messageData);

      // Validate all required fields
      if (!messageData.sender || !messageData.receiver || !messageData.content) {
        console.error('Missing required fields:', {
          sender: messageData.sender,
          receiver: messageData.receiver,
          content: messageData.content
        });
        setNotification({
          open: true,
          message: 'Missing required fields for message',
          severity: 'error'
        });
        return;
      }

      const response = await chatApi.sendMessage(messageData);
      console.log('Message response:', response);

      if (response.success && response.data) {
        const newMessage = {
          id: response.data._id,
          sender: 'You',
          avatar: `${user.firstName} ${user.lastName}`.charAt(0),
          message: message.trim(),
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isOwn: true,
        };
        
        setMessages(prev => ({
          ...prev,
          [selectedChat.id]: [...(prev[selectedChat.id] || []), newMessage]
        }));
        
        setMessage('');
        setNotification({
          open: true,
          message: 'Message sent successfully',
          severity: 'success'
        });
      } else {
        throw new Error(response.message || 'Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to send message';
      const requiredFields = error.response?.data?.required;
      
      if (requiredFields) {
        const missingFields = Object.entries(requiredFields)
          .filter(([_, missing]) => missing)
          .map(([field]) => field)
          .join(', ');
        setNotification({
          open: true,
          message: `Missing required fields: ${missingFields}`,
          severity: 'error'
        });
      } else {
        setNotification({
          open: true,
          message: errorMessage,
          severity: 'error'
        });
      }
    }
  };

  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  const ChatList = () => (
    <Paper
      elevation={0}
      sx={{
        height: '100%',
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
        overflow: 'hidden',
      }}
    >
      <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
        <TextField
          fullWidth
          placeholder="Search employees..."
          variant="outlined"
          size="small"
          InputProps={{
            startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />,
          }}
        />
      </Box>
      <List sx={{ p: 0 }}>
        {employees.map((employee) => (
          <ListItem
            key={employee.id}
            button
            selected={selectedChat?.id === employee.id}
            onClick={() => setSelectedChat(employee)}
            sx={{
              borderBottom: '1px solid',
              borderColor: 'divider',
              '&.Mui-selected': {
                bgcolor: `${theme.palette.primary.main}15`,
              },
            }}
          >
            <ListItemAvatar>
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                variant="dot"
                color={employee.online ? 'success' : 'default'}
              >
                <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                  {employee.avatar}
                </Avatar>
              </Badge>
            </ListItemAvatar>
            <ListItemText
              primary={employee.name}
              secondary={employee.role}
              primaryTypographyProps={{
                fontWeight: employee.unread ? 'bold' : 'normal',
              }}
              secondaryTypographyProps={{
                color: employee.unread ? 'text.primary' : 'text.secondary',
                noWrap: true,
              }}
            />
            <ListItemSecondaryAction>
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                  {employee.time}
                </Typography>
                {employee.unread > 0 && (
                  <Badge
                    badgeContent={employee.unread}
                    color="primary"
                    sx={{ mt: 0.5 }}
                  />
                )}
              </Box>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </Paper>
  );

  const ChatWindow = () => (
    <Paper
      elevation={0}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
      }}
    >
      {selectedChat ? (
        <>
          <Box
            sx={{
              p: 2,
              borderBottom: '1px solid',
              borderColor: 'divider',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ bgcolor: theme.palette.primary.main, mr: 2 }}>
              {selectedChat.avatar}
            </Avatar>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                {selectedChat.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {selectedChat.role}
              </Typography>
            </Box>
            <IconButton>
              <MoreVertIcon />
            </IconButton>
          </Box>

          <Box
            sx={{
              flexGrow: 1,
              p: 2,
              overflow: 'auto',
              bgcolor: 'background.default',
            }}
          >
            {messages[selectedChat.id]?.map((msg) => (
              <Box
                key={msg.id}
                sx={{
                  display: 'flex',
                  justifyContent: msg.isOwn ? 'flex-end' : 'flex-start',
                  mb: 2,
                }}
              >
                {!msg.isOwn && (
                  <Avatar
                    sx={{
                      width: 32,
                      height: 32,
                      mr: 1,
                      bgcolor: theme.palette.primary.main,
                    }}
                  >
                    {msg.avatar}
                  </Avatar>
                )}
                <Box
                  sx={{
                    maxWidth: '70%',
                    bgcolor: msg.isOwn ? 'primary.main' : 'background.paper',
                    color: msg.isOwn ? 'white' : 'text.primary',
                    p: 2,
                    borderRadius: 2,
                    boxShadow: 1,
                  }}
                >
                  <Typography variant="body1">{msg.message}</Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      display: 'block',
                      mt: 0.5,
                      color: msg.isOwn ? 'rgba(255,255,255,0.7)' : 'text.secondary',
                    }}
                  >
                    {msg.time}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>

          <Box
            sx={{
              p: 2,
              borderTop: '1px solid',
              borderColor: 'divider',
              bgcolor: 'background.paper',
            }}
          >
            <Grid container spacing={1} alignItems="center">
              <Grid item>
                <IconButton>
                  <AttachFileIcon />
                </IconButton>
              </Grid>
              <Grid item>
                <IconButton>
                  <EmojiIcon />
                </IconButton>
              </Grid>
              <Grid item xs>
                <TextField
                  fullWidth
                  placeholder="Type a message..."
                  variant="outlined"
                  size="small"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
              </Grid>
              <Grid item>
                <IconButton
                  color="primary"
                  onClick={handleSendMessage}
                  disabled={!message.trim()}
                >
                  <SendIcon />
                </IconButton>
              </Grid>
            </Grid>
          </Box>
        </>
      ) : (
        <Box
          sx={{
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            p: 3,
          }}
        >
          <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
            Select an employee to start messaging
          </Typography>
          <Button
            variant="contained"
            startIcon={<SendIcon />}
            sx={{ borderRadius: 2 }}
          >
            Start New Chat
          </Button>
        </Box>
      )}
    </Paper>
  );

  return (
    <Box sx={{ p: isMobile ? 1 : 3 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
            Messages
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Chat with your employees
          </Typography>
        </Box>

        <Grid container spacing={3} sx={{ height: 'calc(100vh - 200px)' }}>
          <Grid item xs={12} md={4} lg={3}>
            <ChatList />
          </Grid>
          <Grid item xs={12} md={8} lg={9}>
            <ChatWindow />
          </Grid>
        </Grid>
      </motion.div>

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default MessagesSection; 