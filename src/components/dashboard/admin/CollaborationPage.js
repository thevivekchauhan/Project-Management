import { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  Avatar,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  useTheme,
  useMediaQuery,
  Paper,
} from '@mui/material';
import { motion } from 'framer-motion';
import { Group, Send, AddCircle } from '@mui/icons-material';

const CollaborationPage = () => {
  const [openInviteDialog, setOpenInviteDialog] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  const teamMembers = [
    { id: 1, name: 'Ankit Sir', role: 'Project Manager', avatar: 'AS' },
    { id: 2, name: 'Vivek Chauhan', role: 'Developer', avatar: 'VC' },
    { id: 3, name: 'Ishant Sharma', role: 'Designer', avatar: 'IS' },
    { id: 4, name: 'Darshan Patel', role: 'QA Engineer', avatar: 'DP' },
  ];

  const handleInvite = () => {
    // Implement invite functionality
    setInviteEmail('');
    setOpenInviteDialog(false);
  };

  return (
    <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
      <Typography
        variant={isMobile ? "h5" : "h4"}
        sx={{
          mb: { xs: 2, sm: 3 },
          fontWeight: 600,
          color: '#1a237e',
          fontSize: { xs: '1.5rem', sm: '1.8rem', md: '2rem' }
        }}
      >
        Team Collaboration
      </Typography>

      <Grid container spacing={{ xs: 2, sm: 3 }}>
        {/* Team Overview Card */}
        <Grid item xs={12} md={4}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card
              sx={{
                p: { xs: 2, sm: 3 },
                height: '100%',
                background: 'linear-gradient(135deg, #1976d2 0%, #2196f3 100%)',
                color: 'white',
                borderRadius: { xs: 1, sm: 2 }
              }}
            >
              <Box sx={{ textAlign: 'center', mb: { xs: 2, sm: 3 } }}>
                <Group sx={{ fontSize: { xs: 40, sm: 48 }, mb: { xs: 1, sm: 2 } }} />
                <Typography variant={isMobile ? "h6" : "h5"} gutterBottom>
                  Team Members
                </Typography>
                <Typography 
                  variant={isMobile ? "h4" : "h3"} 
                  sx={{ 
                    fontWeight: 'bold',
                    fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }
                  }}
                >
                  {teamMembers.length}
                </Typography>
              </Box>
              <Button
                fullWidth
                variant="contained"
                startIcon={<AddCircle />}
                onClick={() => setOpenInviteDialog(true)}
                sx={{
                  mt: { xs: 1, sm: 2 },
                  bgcolor: 'rgba(255, 255, 255, 0.2)',
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.3)',
                  },
                  fontSize: { xs: '0.875rem', sm: '1rem' }
                }}
              >
                Invite Member
              </Button>
            </Card>
          </motion.div>
        </Grid>

        {/* Team Members List */}
        <Grid item xs={12} md={8}>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Paper sx={{ 
              p: { xs: 2, sm: 3 }, 
              borderRadius: { xs: 1, sm: 2 }
            }}>
              <Typography 
                variant="h6" 
                gutterBottom
                sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}
              >
                Active Team Members
              </Typography>
              <List>
                {teamMembers.map((member, index) => (
                  <motion.div
                    key={member.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <ListItem
                      sx={{
                        borderRadius: 1,
                        mb: 1,
                        flexDirection: { xs: 'column', sm: 'row' },
                        alignItems: { xs: 'flex-start', sm: 'center' },
                        gap: { xs: 1, sm: 0 },
                        p: { xs: 1.5, sm: 2 },
                        '&:hover': {
                          bgcolor: 'rgba(0, 0, 0, 0.04)',
                        },
                      }}
                    >
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        width: { xs: '100%', sm: 'auto' },
                        mb: { xs: 1, sm: 0 }
                      }}>
                        <ListItemAvatar>
                          <Avatar 
                            sx={{ 
                              bgcolor: theme.palette.primary.main,
                              width: { xs: 35, sm: 40 },
                              height: { xs: 35, sm: 40 },
                              fontSize: { xs: '1rem', sm: '1.25rem' }
                            }}
                          >
                            {member.avatar}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={member.name}
                          secondary={member.role}
                          primaryTypographyProps={{
                            fontWeight: 500,
                            fontSize: { xs: '0.9rem', sm: '1rem' }
                          }}
                          secondaryTypographyProps={{
                            fontSize: { xs: '0.8rem', sm: '0.875rem' }
                          }}
                        />
                      </Box>
                      <Button
                        size={isMobile ? "small" : "medium"}
                        startIcon={<Send />}
                        sx={{ 
                          ml: { xs: 0, sm: 2 },
                          width: { xs: '100%', sm: 'auto' },
                          fontSize: { xs: '0.8rem', sm: '0.875rem' }
                        }}
                      >
                        Message
                      </Button>
                    </ListItem>
                  </motion.div>
                ))}
              </List>
            </Paper>
          </motion.div>
        </Grid>
      </Grid>

      {/* Invite Dialog */}
      <Dialog
        open={openInviteDialog}
        onClose={() => setOpenInviteDialog(false)}
        maxWidth="sm"
        fullWidth
        fullScreen={isMobile}
      >
        <DialogTitle sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' } }}>
          Invite Team Member
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Email Address"
            type="email"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            sx={{ 
              mt: 2,
              '& .MuiInputLabel-root': { 
                fontSize: { xs: '0.9rem', sm: '1rem' } 
              },
              '& .MuiInputBase-input': {
                fontSize: { xs: '0.9rem', sm: '1rem' }
              }
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: { xs: 2, sm: 3 } }}>
          <Button 
            onClick={() => setOpenInviteDialog(false)}
            sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleInvite}
            disabled={!inviteEmail}
            sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
          >
            Send Invitation
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CollaborationPage;