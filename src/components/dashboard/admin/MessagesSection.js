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
} from '@mui/material';
import {
  Send as SendIcon,
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
  AttachFile as AttachFileIcon,
  EmojiEmotions as EmojiIcon,
} from '@mui/icons-material';
import { userApi } from '../../../services/api';

const MessagesSection = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState('');
  const [employees, setEmployees] = useState([]);
  const [messages, setMessages] = useState({});

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await userApi.getAllUsers();
      if (response.success && response.users) {
        const employeeList = response.users.map(user => ({
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
        const initialMessages = {};
        employeeList.forEach(emp => {
          initialMessages[emp.id] = [];
        });
        setMessages(initialMessages);
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const handleSendMessage = () => {
    if (message.trim() && selectedChat) {
      const newMessage = {
        id: Date.now(),
        sender: 'You',
        avatar: 'A',
        message: message.trim(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isOwn: true,
      };
      
      setMessages(prev => ({
        ...prev,
        [selectedChat.id]: [...(prev[selectedChat.id] || []), newMessage]
      }));
      
      setMessage('');
    }
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
    </Box>
  );
};

export default MessagesSection; 