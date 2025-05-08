import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Chip,
  Button,
  Avatar,
  AvatarGroup,
  LinearProgress,
  useTheme,
  useMediaQuery,
  IconButton,
} from '@mui/material';
import {
  Add as AddIcon,
  CalendarToday,
  Group,
  ArrowForward,
  Star,
  StarBorder,
} from '@mui/icons-material';

const Projects = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  const [projects, setProjects] = useState([
    // {
    //   id: 1,
    //   title: 'Website Redesign',
    //   description: 'Complete overhaul of the company website with modern design and improved UX',
    //   progress: 75,
    //   deadline: '2024-06-15',
    //   team: ['JD', 'AB', 'CD', 'EF'],
    //   status: 'In Progress',
    //   priority: 'High',
    //   tasks: { total: 24, completed: 18 },
    // },
    // {
    //   id: 2,
    //   title: 'Mobile App Development',
    //   description: 'Development of a new mobile application for iOS and Android platforms',
    //   progress: 45,
    //   deadline: '2024-07-30',
    //   team: ['JD', 'GH', 'IJ'],
    //   status: 'In Progress',
    //   priority: 'Medium',
    //   tasks: { total: 36, completed: 16 },
    // },
    // {
    //   id: 3,
    //   title: 'Database Migration',
    //   description: 'Migration of legacy database to new cloud-based solution',
    //   progress: 90,
    //   deadline: '2024-05-20',
    //   team: ['JD', 'KL', 'MN'],
    //   status: 'Almost Done',
    //   priority: 'High',
    //   tasks: { total: 12, completed: 11 },
    // },
  ]);

  const ProjectCard = ({ project }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Paper
        elevation={0}
        sx={{
          p: 3,
          height: '100%',
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'divider',
          '&:hover': {
            boxShadow: 2,
          },
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
              {project.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {project.description}
            </Typography>
          </Box>
          <IconButton size="small">
            <StarBorder />
          </IconButton>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <CalendarToday sx={{ fontSize: 16, color: 'text.secondary', mr: 1 }} />
            <Typography variant="body2" color="text.secondary">
              Due: {project.deadline}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Group sx={{ fontSize: 16, color: 'text.secondary', mr: 1 }} />
            <AvatarGroup max={4} sx={{ '& .MuiAvatar-root': { width: 24, height: 24, fontSize: '0.75rem' } }}>
              {project.team.map((member, index) => (
                <Avatar key={index} sx={{ bgcolor: theme.palette.primary.main }}>
                  {member}
                </Avatar>
              ))}
            </AvatarGroup>
          </Box>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Progress
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {project.progress}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={project.progress}
            sx={{
              height: 6,
              borderRadius: 3,
              bgcolor: `${theme.palette.primary.main}15`,
              '& .MuiLinearProgress-bar': {
                borderRadius: 3,
              },
            }}
          />
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Chip
              label={project.status}
              size="small"
              color={project.status === 'Almost Done' ? 'success' : 'primary'}
              sx={{ mr: 1 }}
            />
            <Chip
              label={project.priority}
              size="small"
              color={project.priority === 'High' ? 'error' : 'warning'}
            />
          </Box>
          <Button
            size="small"
            endIcon={<ArrowForward />}
            color="primary"
          >
            View Details
          </Button>
        </Box>
      </Paper>
    </motion.div>
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
              My Projects
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Track and manage your ongoing projects
            </Typography>
          </Box>
          {/* <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              px: 3,
            }}
          >
            New Project
          </Button> */}
        </Box>

        <Grid container spacing={3}>
          {projects.map((project) => (
            <Grid item xs={12} md={6} lg={4} key={project.id}>
              <ProjectCard project={project} />
            </Grid>
          ))}
        </Grid>
      </motion.div>
    </Box>
  );
};

export default Projects; 