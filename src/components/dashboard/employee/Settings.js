import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import {
  Box,
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Divider,
  Avatar,
  IconButton,
  useTheme,
  useMediaQuery,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Save as SaveIcon,
  PhotoCamera as PhotoCameraIcon,
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  Language as LanguageIcon,
  Palette as PaletteIcon,
} from '@mui/icons-material';
import { updateProfile } from '../../../store/authSlice';

const Settings = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.auth);

  const [settings, setSettings] = useState({
    profile: {
      firstName: '',
      lastName: '',
      email: '',
      department: '',
    },
    notifications: {
      email: true,
      push: true,
      taskUpdates: true,
      projectUpdates: true,
      mentions: true,
    },
  });

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('success');

  useEffect(() => {
    if (user) {
      setSettings({
        ...settings,
        profile: {
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          email: user.email || '',
          department: user.department || '',
        }
      });
    }
  }, [user]);

  const handleSave = async () => {
    try {
      await dispatch(updateProfile({
        firstName: settings.profile.firstName,
        lastName: settings.profile.lastName,
        email: settings.profile.email,
        department: settings.profile.department,
      })).unwrap();
      
      setAlertMessage('Profile updated successfully!');
      setAlertSeverity('success');
      setShowAlert(true);
    } catch (err) {
      setAlertMessage(err || 'Failed to update profile');
      setAlertSeverity('error');
      setShowAlert(true);
    }
    
    setTimeout(() => setShowAlert(false), 3000);
  };

  const SettingSection = ({ title, icon, children }) => (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
        mb: 3,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        {icon}
        <Typography variant="h6" sx={{ ml: 1, fontWeight: 'bold' }}>
          {title}
        </Typography>
      </Box>
      {children}
    </Paper>
  );

  return (
    <Box sx={{ p: isMobile ? 1 : 3 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
              Settings
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage your account settings and preferences
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
            onClick={handleSave}
            disabled={loading}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              px: 3,
            }}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </Box>

        {showAlert && (
          <Alert
            severity={alertSeverity}
            sx={{ mb: 3 }}
            onClose={() => setShowAlert(false)}
          >
            {alertMessage}
          </Alert>
        )}

        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <SettingSection
              title="Profile Information"
              icon={<PhotoCameraIcon sx={{ color: theme.palette.primary.main }} />}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Avatar
                  sx={{
                    width: 100,
                    height: 100,
                    bgcolor: theme.palette.primary.main,
                    fontSize: '2rem',
                  }}
                >
                  {settings.profile.firstName?.charAt(0)}
                </Avatar>
                <Box sx={{ ml: 3 }}>
                  {/* <Button
                    variant="outlined"
                    startIcon={<PhotoCameraIcon />}
                    sx={{ mb: 1 }}
                  >
                    Change Photo
                  </Button> */}
                  {/* <Typography variant="body2" color="text.secondary">
                    JPG, GIF or PNG. Max size of 2MB.
                  </Typography> */}
                </Box>
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="First Name"
                    value={settings.profile.firstName}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        profile: { ...settings.profile, firstName: e.target.value },
                      })
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Last Name"
                    value={settings.profile.lastName}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        profile: { ...settings.profile, lastName: e.target.value },
                      })
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    value={settings.profile.email}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        profile: { ...settings.profile, email: e.target.value },
                      })
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Department"
                    value={settings.profile.department}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        profile: { ...settings.profile, department: e.target.value },
                      })
                    }
                  />
                </Grid>
              </Grid>
            </SettingSection>

          </Grid>

          {/* <Grid item xs={12} md={4}>

            <SettingSection
              title="Security"
              icon={<SecurityIcon sx={{ color: theme.palette.primary.main }} />}
            >
              <Button
                fullWidth
                variant="outlined"
                sx={{ mb: 2 }}
              >
                Change Password
              </Button>
              <Button
                fullWidth
                variant="outlined"
                color="error"
              >
                Delete Account
              </Button>
            </SettingSection>
          </Grid> */}
        </Grid>
      </motion.div>
    </Box>
  );
};

export default Settings;