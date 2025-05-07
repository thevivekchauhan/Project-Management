import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Box,
  Paper,
  Typography,
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

const Messages = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState('');

  const [chats, setChats] = useState([
    {
      id: 1,
      name: 'Ishant',
      avatar: 'SW',
      lastMessage: 'Can we discuss the project timeline?',
      time: '10:30 AM',
      unread: 2,
      online: true,
    },
    {
      id: 2,
      name: 'Darshan',
      avatar: 'MJ',
      lastMessage: 'The new design looks great!',
      time: 'Yesterday',
      unread: 0,
      online: false,
    },
    {
      id: 3,
      name: 'Team Chat',
      avatar: 'TC',
      lastMessage: 'Meeting at 2 PM today',
      time: 'Yesterday',
      unread: 5,
      online: true,
    },
  ]);

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'Ishant',
      avatar: 'SW',
      message: "Hi Vivek, how's the project going?",
      time: '10:30 AM',
      isOwn: false,
    },
    {
      id: 2,
      sender: 'You',
      avatar: 'JD',
      message: 'Going well! Just finished the initial design phase.',
      time: '10:32 AM',
      isOwn: true,
    },
    {
      id: 3,
      sender: 'Ishant',
      avatar: 'SW',
      message: "That's great! Can we discuss the project timeline?",
      time: '10:33 AM',
      isOwn: false,
    },
  ]);

  const handleSendMessage = () => {
    if (message.trim()) {
      setMessages([
        ...messages,
        {
          id: messages.length + 1,
          sender: 'You',
          avatar: 'JD',
          message: message.trim(),
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isOwn: true,
        },
      ]);
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
          placeholder="Search messages..."
          variant="outlined"
          size="small"
          InputProps={{
            startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />,
          }}
        />
      </Box>
      <List sx={{ p: 0 }}>
        {chats.map((chat) => (
          <ListItem
            key={chat.id}
            button
            selected={selectedChat?.id === chat.id}
            onClick={() => setSelectedChat(chat)}
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
                color={chat.online ? 'success' : 'default'}
              >
                <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                  {chat.avatar}
                </Avatar>
              </Badge>
            </ListItemAvatar>
            <ListItemText
              primary={chat.name}
              secondary={chat.lastMessage}
              primaryTypographyProps={{
                fontWeight: chat.unread ? 'bold' : 'normal',
              }}
              secondaryTypographyProps={{
                color: chat.unread ? 'text.primary' : 'text.secondary',
                noWrap: true,
              }}
            />
            <ListItemSecondaryAction>
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                  {chat.time}
                </Typography>
                {chat.unread > 0 && (
                  <Badge
                    badgeContent={chat.unread}
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
                {selectedChat.online ? 'Online' : 'Offline'}
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
            {messages.map((msg) => (
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
            Select a chat to start messaging
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
            Chat with your team members
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

export default Messages; 