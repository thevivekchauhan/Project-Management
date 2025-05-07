import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Box,
  Card, 
  TextField, 
  Button, 
  Typography, 
  IconButton, 
  InputAdornment, 
  FormControlLabel, 
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Slider,
  Paper,
  RadioGroup,
  Radio,
  FormControl,
  FormLabel,
  Avatar
} from '@mui/material';
import { Visibility, VisibilityOff, Business, Person } from '@mui/icons-material';
import { login } from '../../store/authSlice';
import { toast } from 'react-toastify';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '', role: '' });
  const [isRobot, setIsRobot] = useState(false);
  const [openVerification, setOpenVerification] = useState(false);
  const [verificationTask, setVerificationTask] = useState({ num1: 0, num2: 0, operator: '+' });
  const [userAnswer, setUserAnswer] = useState('');
  const [sliderValue, setSliderValue] = useState(50);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const generateVerificationTask = () => {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    setVerificationTask({ num1, num2, operator: '+' });
    setUserAnswer('');
  };

  const calculateCorrectAnswer = () => {
    const { num1, num2 } = verificationTask;
    return num1 + num2;
  };

  const handleCheckboxClick = (e) => {
    e.preventDefault();
    if (!isRobot) {
      generateVerificationTask();
      setOpenVerification(true);
    }
  };

  const handleVerificationSubmit = () => {
    const correctAnswer = calculateCorrectAnswer();
    if (parseInt(userAnswer) === correctAnswer && sliderValue === 100) {
      setIsRobot(true);
      setOpenVerification(false);
      toast.success('Verification successful!');
      submitForm();
    } else {
      setUserAnswer('');
      setSliderValue(50);
      generateVerificationTask();
      toast.error('Verification failed. Please try again.');
    }
  };

  const submitForm = async () => {
    try {
      const result = await dispatch(login({
        email: formData.email,
        password: formData.password,
        role: formData.role // Make sure to send the role
      })).unwrap();
      
      toast.success('Login successful!');
      navigate(formData.role === 'admin' ? '/admin' : '/employee');
    } catch (error) {
      toast.error(error || 'Login failed. Please try again.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.role) {
      toast.error('Please select a role');
      return;
    }

    if (!isRobot) {
      toast.error('Please verify that you are not a robot');
      return;
    }

    submitForm();
  };

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      sx={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(120deg, #2196f3 0%, #f50057 100%)',
      }}
    >
      <Card
        component={motion.div}
        whileHover={{ scale: 1.02 }}
        sx={{
          p: 4,
          width: '100%',
          maxWidth: 400,
          borderRadius: 2,
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        }}
      >
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          Welcome Back
        </Typography>
        <form onSubmit={handleSubmit}>
          <FormControl component="fieldset" fullWidth sx={{ mb: 3 }}>
            <RadioGroup
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            >
              <FormControlLabel
                value="admin"
                control={
                  <Radio
                    sx={{
                      '&.Mui-checked': {
                        color: '#2196f3',
                      },
                    }}
                  />
                }
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar sx={{ bgcolor: '#2196f3' }}>
                      <Business />
                    </Avatar>
                    <Box>
                      <Typography variant="body1">Administrator</Typography>
                      <Typography variant="body2" color="textSecondary">
                        Manage employees and system
                      </Typography>
                    </Box>
                  </Box>
                }
              />
              <FormControlLabel
                value="employee"
                control={
                  <Radio
                    sx={{
                      '&.Mui-checked': {
                        color: '#f50057',
                      },
                    }}
                  />
                }
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar sx={{ bgcolor: '#f50057' }}>
                      <Person />
                    </Avatar>
                    <Box>
                      <Typography variant="body1">Employee</Typography>
                      <Typography variant="body2" color="textSecondary">
                        Access your dashboard
                      </Typography>
                    </Box>
                  </Box>
                }
              />
            </RadioGroup>
          </FormControl>
          <TextField
            fullWidth
            margin="normal"
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          
          <Box sx={{ mt: 2, mb: 2, display: 'flex', justifyContent: 'center' }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={isRobot}
                  onChange={() => {}}
                  onClick={handleCheckboxClick}
                  sx={{
                    '&.Mui-checked': {
                      color: '#2196f3',
                    },
                  }}
                />
              }
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography>I'm not a robot</Typography>
                </Box>
              }
            />
          </Box>

          <Button
            component={motion.button}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            fullWidth
            type="submit"
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Login
          </Button>
          <Typography align="center" color="textSecondary">
            Don't have an account?{' '}
            <Link
              to="/signup"
              style={{
                color: '#2196f3',
                textDecoration: 'none',
                fontWeight: 500,
              }}
            >
              Sign Up
            </Link>
          </Typography>
        </form>

        <Dialog open={openVerification} onClose={() => setOpenVerification(false)}>
          <DialogTitle>Verify You're Human</DialogTitle>
          <DialogContent>
            <Box sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Complete these tasks to verify:
              </Typography>
              
              <Paper elevation={3} sx={{ p: 3, mb: 3, background: '#f5f5f5' }}>
                <Typography variant="body1" gutterBottom>
                  1. Solve this math problem:
                </Typography>
                <Typography variant="h5" align="center" gutterBottom>
                  {verificationTask.num1} {verificationTask.operator} {verificationTask.num2} = ?
                </Typography>
                <TextField
                  fullWidth
                  type="number"
                  label="Your Answer"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  sx={{ mt: 2 }}
                />
              </Paper>

              <Paper elevation={3} sx={{ p: 3, background: '#f5f5f5' }}>
                <Typography variant="body1" gutterBottom>
                  2. Move the slider to 100%:
                </Typography>
                <Slider
                  value={sliderValue}
                  onChange={(e, newValue) => setSliderValue(newValue)}
                  sx={{ mt: 2 }}
                />
                <Typography variant="body2" align="right">
                  {sliderValue}%
                </Typography>
              </Paper>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenVerification(false)}>Cancel</Button>
            <Button 
              onClick={handleVerificationSubmit}
              variant="contained"
              disabled={!userAnswer || sliderValue !== 100}
            >
              Verify
            </Button>
          </DialogActions>
        </Dialog>
      </Card>
    </Box>
  );
};

export default Login;