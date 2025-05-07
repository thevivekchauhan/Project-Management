import { useState } from 'react';
import { Box, Card, Typography, ToggleButton, ToggleButtonGroup, useMediaQuery, useTheme } from '@mui/material';
import { PieChart, BarChart } from '@mui/icons-material';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

const TaskStatusChart = ({ tasks }) => {
  const [chartType, setChartType] = useState('pie');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Calculate task status counts
  const statusCounts = tasks.reduce((acc, task) => {
    acc[task.status] = (acc[task.status] || 0) + 1;
    return acc;
  }, {});

  const chartData = {
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

  const options = {
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

  const barOptions = {
    ...options,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          font: {
            size: isMobile ? 10 : 12,
            family: theme.typography.fontFamily
          }
        },
        grid: {
          display: true,
          color: 'rgba(0, 0, 0, 0.1)',
        }
      },
      x: {
        ticks: {
          font: {
            size: isMobile ? 10 : 12,
            family: theme.typography.fontFamily
          }
        },
        grid: {
          display: false
        }
      }
    },
  };

  return (
    <Card
      sx={{
        p: { xs: 2, sm: 3 },
        height: '100%',
        minHeight: { xs: 350, sm: 400, md: 450 },
        display: 'flex',
        flexDirection: 'column',
        borderRadius: { xs: 1, sm: 2 },
        boxShadow: '0 4px 20px 0 rgba(0,0,0,0.1)',
      }}
    >
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: { xs: 2, sm: 3 }
      }}>
        <Typography
          variant={isMobile ? "h6" : "h5"}
          sx={{
            fontWeight: 600,
            color: '#1a237e',
            fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.4rem' }
          }}
        >
          Task Overview
        </Typography>
        <ToggleButtonGroup
          value={chartType}
          exclusive
          onChange={(e, newValue) => {
            if (newValue !== null) {
              setChartType(newValue);
            }
          }}
          size={isMobile ? "small" : "medium"}
          sx={{
            '& .MuiToggleButton-root': {
              px: { xs: 1, sm: 2 },
              py: { xs: 0.5, sm: 1 }
            }
          }}
        >
          <ToggleButton value="pie">
            <PieChart sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' } }} />
          </ToggleButton>
          <ToggleButton value="bar">
            <BarChart sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' } }} />
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <Box sx={{ 
        flexGrow: 1, 
        height: { xs: '300px', sm: '350px', md: '400px' },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative'
      }}>
        {tasks.length === 0 ? (
          <Typography color="text.secondary">No tasks available</Typography>
        ) : chartType === 'pie' ? (
          <Pie data={chartData} options={options} />
        ) : (
          <Bar data={chartData} options={barOptions} />
        )}
      </Box>
    </Card>
  );
};

export default TaskStatusChart;