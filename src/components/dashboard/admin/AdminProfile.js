import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Box,
  Card,
  Avatar,
  Typography,
  Grid,
  Chip,
  Divider,
  IconButton,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Edit as EditIcon,
  Email,
  Phone,
  LocationOn,
  Work,
  CalendarToday,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const AdminProfile = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

  // Mock data - replace with actual data from your backend
  const profileData = {
    name: 'Admin User',
    role: 'Administrator',
    email: 'admin@example.com',
    phone: '+1 234 567 890',
    location: 'New York, USA',
    department: 'Management',
    joinDate: 'April 2025',
    avatar: 'A',
    skills: ['Project Management', 'Team Leadership', 'Strategic Planning', 'System Administration'],
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
          <Grid container spacing={3}>
            {/* Profile Header */}
            <Grid item xs={12} md={4}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                }}
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Avatar
                    sx={{
                      width: { xs: 100, sm: 120, md: 150 },
                      height: { xs: 100, sm: 120, md: 150 },
                      fontSize: { xs: '2.5rem', sm: '3rem', md: '3.5rem' },
                      bgcolor: theme.palette.primary.main,
                      mb: 2,
                    }}
                  >
                    {profileData.avatar}
                  </Avatar>
                </motion.div>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 600,
                    mb: 1,
                    color: theme.palette.text.primary,
                  }}
                >
                  {profileData.name}
                </Typography>
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: theme.palette.primary.main,
                    mb: 2,
                    fontWeight: 500,
                  }}
                >
                  {profileData.role}
                </Typography>
                <IconButton
                  onClick={() => navigate('/admin/profile/edit')}
                  sx={{
                    bgcolor: theme.palette.primary.main,
                    color: 'white',
                    '&:hover': {
                      bgcolor: theme.palette.primary.dark,
                    },
                  }}
                >
                  <EditIcon />
                </IconButton>
              </Box>
            </Grid>

            {/* Profile Details */}
            <Grid item xs={12} md={8}>
              <motion.div variants={itemVariants}>
                <Typography
                  variant="h6"
                  sx={{
                    mb: 3,
                    fontWeight: 600,
                    color: theme.palette.text.primary,
                  }}
                >
                  Profile Information
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Email sx={{ mr: 2, color: theme.palette.primary.main }} />
                      <Typography variant="body1">{profileData.email}</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Phone sx={{ mr: 2, color: theme.palette.primary.main }} />
                      <Typography variant="body1">{profileData.phone}</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <LocationOn sx={{ mr: 2, color: theme.palette.primary.main }} />
                      <Typography variant="body1">{profileData.location}</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Work sx={{ mr: 2, color: theme.palette.primary.main }} />
                      <Typography variant="body1">{profileData.department}</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <CalendarToday sx={{ mr: 2, color: theme.palette.primary.main }} />
                      <Typography variant="body1">Joined {profileData.joinDate}</Typography>
                    </Box>
                  </Grid>
                </Grid>

                <Divider sx={{ my: 3 }} />

                {/* <Typography
                  variant="h6"
                  sx={{
                    mb: 2,
                    fontWeight: 600,
                    color: theme.palette.text.primary,
                  }}
                >
                  Skills & Expertise
                </Typography> */}

                {/* <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {profileData.skills.map((skill, index) => (
                    <motion.div
                      key={skill}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Chip
                        label={skill}
                        sx={{
                          bgcolor: theme.palette.primary.light,
                          color: theme.palette.primary.main,
                          fontWeight: 500,
                          '&:hover': {
                            bgcolor: theme.palette.primary.main,
                            color: 'white',
                          },
                        }}
                      />
                    </motion.div>
                  ))}
                </Box> */}
              </motion.div>
            </Grid>
          </Grid>
        </Card>
      </Box>
    </motion.div>
  );
};

export default AdminProfile; 