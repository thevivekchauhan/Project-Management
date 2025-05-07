import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Box,
  Card,
  Avatar,
  Typography,
  Grid,
  TextField,
  Button,
  IconButton,
  useTheme,
  useMediaQuery,
  Divider,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  Save as SaveIcon,
  ArrowBack as ArrowBackIcon,
  PhotoCamera,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const AdminProfileEdit = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(false);

  // Mock data - replace with actual data from your backend
  const [formData, setFormData] = useState({
    name: 'Admin User',
    email: 'admin@example.com',
    phone: '+1 234 567 890',
    location: 'New York, USA',
    department: 'Management',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your form submission logic here
    setShowSuccess(true);
    setTimeout(() => {
      navigate('/admin/profile');
    }, 2000);
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3 },
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <Box sx={{ maxWidth: 1200, mx: 'auto', p: { xs: 2, sm: 3 } }}>
        <Card
          component={motion.div}
          whileHover={{ y: -5 }}
          sx={{
            p: { xs: 2, sm: 3, md: 4 },
            borderRadius: 2,
            background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
            <IconButton
              onClick={() => navigate('/admin/profile')}
              sx={{ mr: 2 }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 600,
                color: theme.palette.text.primary,
              }}
            >
              Edit Profile
            </Typography>
          </Box>

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Profile Picture Section */}
              <Grid item xs={12} md={4}>
                <motion.div variants={itemVariants}>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center',
                    }}
                  >
                    <Box sx={{ position: 'relative' }}>
                      <Avatar
                        sx={{
                          width: { xs: 100, sm: 120, md: 150 },
                          height: { xs: 100, sm: 120, md: 150 },
                          fontSize: { xs: '2.5rem', sm: '3rem', md: '3.5rem' },
                          bgcolor: theme.palette.primary.main,
                          mb: 2,
                        }}
                      >
                        A
                      </Avatar>
                      <IconButton
                        sx={{
                          position: 'absolute',
                          bottom: 16,
                          right: 0,
                          bgcolor: theme.palette.primary.main,
                          color: 'white',
                          '&:hover': {
                            bgcolor: theme.palette.primary.dark,
                          },
                        }}
                      >
                        <PhotoCamera />
                      </IconButton>
                    </Box>
                    <Typography
                      variant="body2"
                      sx={{ color: 'text.secondary', mt: 1 }}
                    >
                      Click to change profile picture
                    </Typography>
                  </Box>
                </motion.div>
              </Grid>

              {/* Form Fields */}
              <Grid item xs={12} md={8}>
                <motion.div variants={itemVariants}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Full Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Location"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Department"
                        name="department"
                        value={formData.department}
                        onChange={handleChange}
                        variant="outlined"
                      />
                    </Grid>
                  </Grid>

                  <Divider sx={{ my: 4 }} />

                  <Typography
                    variant="h6"
                    sx={{
                      mb: 3,
                      fontWeight: 600,
                      color: theme.palette.text.primary,
                    }}
                  >
                    Change Password
                  </Typography>

                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Current Password"
                        name="currentPassword"
                        type="password"
                        value={formData.currentPassword}
                        onChange={handleChange}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="New Password"
                        name="newPassword"
                        type="password"
                        value={formData.newPassword}
                        onChange={handleChange}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Confirm New Password"
                        name="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        variant="outlined"
                      />
                    </Grid>
                  </Grid>

                  <Box
                    sx={{
                      mt: 4,
                      display: 'flex',
                      justifyContent: 'flex-end',
                      gap: 2,
                    }}
                  >
                    <Button
                      variant="outlined"
                      onClick={() => navigate('/admin/profile')}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      startIcon={<SaveIcon />}
                      sx={{
                        background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                        boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
                      }}
                    >
                      Save Changes
                    </Button>
                  </Box>
                </motion.div>
              </Grid>
            </Grid>
          </form>
        </Card>
      </Box>

      <Snackbar
        open={showSuccess}
        autoHideDuration={2000}
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          severity="success"
          sx={{
            width: '100%',
            bgcolor: 'success.main',
            color: 'white',
          }}
        >
          Profile updated successfully!
        </Alert>
      </Snackbar>
    </motion.div>
  );
};

export default AdminProfileEdit; 