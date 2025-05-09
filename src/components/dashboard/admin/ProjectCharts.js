import { useState, useEffect } from 'react';
import { Box, Card, Typography, ToggleButton, ToggleButtonGroup, useMediaQuery, useTheme, Grid } from '@mui/material';
import { PieChart, ShowChart } from '@mui/icons-material';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title } from 'chart.js';
import { Pie, Line } from 'react-chartjs-2';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title
);

const ProjectCharts = ({ projects }) => {
  const [chartData, setChartData] = useState({
    statusData: {
      labels: [],
      datasets: []
    },
    progressData: {
      labels: [],
      datasets: []
    }
  });
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Process project data whenever projects change
  useEffect(() => {
    if (!projects || projects.length === 0) return;

    // Calculate project status counts
    const statusCounts = projects.reduce((acc, project) => {
      acc[project.status] = (acc[project.status] || 0) + 1;
      return acc;
    }, {});

    // Prepare data for pie chart (status distribution)
    const statusData = {
      labels: ['To Do', 'In Progress', 'Done'],
      datasets: [
        {
          data: [
            statusCounts['To Do'] || 0,
            statusCounts['In Progress'] || 0,
            statusCounts['Done'] || 0,
          ],
          backgroundColor: [
            'rgba(117, 117, 117, 0.8)',  // To Do - Grey
            'rgba(33, 150, 243, 0.8)',   // In Progress - Blue
            'rgba(76, 175, 80, 0.8)',    // Done - Green
          ],
          borderColor: [
            'rgba(117, 117, 117, 1)',
            'rgba(33, 150, 243, 1)',
            'rgba(76, 175, 80, 1)',
          ],
          borderWidth: 1,
        },
      ],
    };

    // Prepare data for line chart (progress by project)
    const sortedProjects = [...projects].sort((a, b) => a.progress - b.progress);
    const progressData = {
      labels: sortedProjects.map(project => project.name),
      datasets: [
        {
          label: 'Progress (%)',
          data: sortedProjects.map(project => project.progress),
          borderColor: 'rgba(33, 150, 243, 1)',
          backgroundColor: 'rgba(33, 150, 243, 0.2)',
          tension: 0.4,
          fill: true,
        }
      ]
    };

    setChartData({
      statusData,
      progressData
    });
  }, [projects]);

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: isMobile ? 'bottom' : 'right',
        labels: {
          font: {
            size: isMobile ? 10 : 14,
            family: theme.typography.fontFamily
          },
          padding: isMobile ? 10 : 25,
          usePointStyle: true,
          boxWidth: 8,
          boxHeight: 8,
        },
      },
      title: {
        display: false,
      },
      tooltip: {
        titleFont: {
          size: isMobile ? 12 : 14,
          family: theme.typography.fontFamily
        },
        bodyFont: {
          size: isMobile ? 11 : 13,
          family: theme.typography.fontFamily
        },
        padding: 12,
        boxPadding: 6
      }
    },
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          stepSize: 20,
          font: {
            size: isMobile ? 10 : 12,
            family: theme.typography.fontFamily
          }
        },
        grid: {
          display: true,
          color: 'rgba(0, 0, 0, 0.1)',
        },
        title: {
          display: true,
          text: 'Progress (%)'
        }
      },
      x: {
        ticks: {
          font: {
            size: isMobile ? 8 : 10,
            family: theme.typography.fontFamily
          },
          maxRotation: 45,
          minRotation: 45
        },
        grid: {
          display: false
        }
      }
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        titleFont: {
          size: isMobile ? 12 : 14,
          family: theme.typography.fontFamily
        },
        bodyFont: {
          size: isMobile ? 11 : 13,
          family: theme.typography.fontFamily
        },
        padding: 12,
        boxPadding: 6,
        callbacks: {
          title: (tooltipItems) => {
            return `Project: ${tooltipItems[0].label}`;
          }
        }
      }
    }
  };

  return (
    <Grid container spacing={3}>
      {/* Project Status Chart (Pie Chart) */}
      <Grid item xs={12} md={6}>
        <Card
          sx={{
            p: { xs: 2, sm: 3 },
            height: '100%',
            minHeight: { xs: 350, sm: 400 },
            display: 'flex',
            flexDirection: 'column',
            borderRadius: { xs: 1, sm: 2 },
            boxShadow: '0 4px 20px 0 rgba(0,0,0,0.1)',
          }}
        >
          <Typography
            variant={isMobile ? "h6" : "h5"}
            sx={{
              fontWeight: 600,
              color: '#1a237e',
              mb: { xs: 2, sm: 3 },
              fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.4rem' }
            }}
          >
            Project Status Distribution
          </Typography>

          <Box sx={{ 
            flexGrow: 1, 
            height: { xs: '280px', sm: '320px' },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative'
          }}>
            {!projects || projects.length === 0 ? (
              <Typography color="text.secondary">No projects available</Typography>
            ) : (
              <Pie data={chartData.statusData} options={pieOptions} />
            )}
          </Box>
        </Card>
      </Grid>

      {/* Project Progress Chart (Line Chart) */}
      <Grid item xs={12} md={6}>
        <Card
          sx={{
            p: { xs: 2, sm: 3 },
            height: '100%',
            minHeight: { xs: 350, sm: 400 },
            display: 'flex',
            flexDirection: 'column',
            borderRadius: { xs: 1, sm: 2 },
            boxShadow: '0 4px 20px 0 rgba(0,0,0,0.1)',
          }}
        >
          <Typography
            variant={isMobile ? "h6" : "h5"}
            sx={{
              fontWeight: 600,
              color: '#1a237e',
              mb: { xs: 2, sm: 3 },
              fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.4rem' }
            }}
          >
            Project Progress
          </Typography>

          <Box sx={{ 
            flexGrow: 1, 
            height: { xs: '280px', sm: '320px' },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative'
          }}>
            {!projects || projects.length === 0 ? (
              <Typography color="text.secondary">No projects available</Typography>
            ) : (
              <Line data={chartData.progressData} options={lineOptions} />
            )}
          </Box>
        </Card>
      </Grid>
    </Grid>
  );
};

export default ProjectCharts; 