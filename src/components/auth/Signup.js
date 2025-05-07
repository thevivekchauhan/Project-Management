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
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Stepper,
  Step,
  StepLabel,
  Avatar,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
  Slider,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  AccountCircle,
  Business,
  Person,
} from '@mui/icons-material';
import { register } from '../../store/authSlice';
import { toast } from 'react-toastify';

const steps = ['Account Type', 'Personal Information', 'Security', 'Verification'];

const Signup = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [isRobot, setIsRobot] = useState(false);
  const [openVerification, setOpenVerification] = useState(false);
  const [verificationTask, setVerificationTask] = useState({ num1: 0, num2: 0, operator: '+' });
  const [userAnswer, setUserAnswer] = useState('');
  const [sliderValue, setSliderValue] = useState(50);
  const [formData, setFormData] = useState({
    role: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    companyName: '', // for admin only
    department: '', // for employee only
  });
  
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

  const handleVerificationSubmit = () => {
    const correctAnswer = calculateCorrectAnswer();
    if (parseInt(userAnswer) === correctAnswer && sliderValue === 100) {
      setIsRobot(true);
      setOpenVerification(false);
      toast.success('Verification successful!');
      // Submit form directly after verification
      submitForm();
    } else {
      setUserAnswer('');
      setSliderValue(50);
      generateVerificationTask();
      toast.error('Verification failed. Please try again.');
    }
  };

  const submitForm = async () => {
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match!');
      return;
    }

    try {
      const result = await dispatch(register(formData)).unwrap();
      toast.success('Registration successful!');
      navigate(formData.role === 'admin' ? '/admin' : '/employee');
    } catch (error) {
      toast.error(error || 'Registration failed. Please try again.');
    }
  };

  const handleNext = () => {
    if (activeStep === steps.length - 2) { // Before last step
      generateVerificationTask();
      setOpenVerification(true);
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    
    if (activeStep !== steps.length - 1) {
      handleNext();
      return;
    }

    if (!isRobot) {
      generateVerificationTask();
      setOpenVerification(true);
      return;
    }

    submitForm();
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <FormControl component="fieldset" fullWidth sx={{ my: 2 }}>
              <FormLabel component="legend">Select Account Type</FormLabel>
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
                          Full access to manage employees and system
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
                          Access to employee dashboard and features
                        </Typography>
                      </Box>
                    </Box>
                  }
                />
              </RadioGroup>
            </FormControl>
          </motion.div>
        );

      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Stack spacing={2}>
              <TextField
                fullWidth
                label="First Name"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                required
              />
              <TextField
                fullWidth
                label="Last Name"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                required
              />
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
              {formData.role === 'admin' ? (
                <TextField
                  fullWidth
                  label="Company Name"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  required
                />
              ) : (
                <TextField
                  fullWidth
                  label="Department"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  required
                />
              )}
            </Stack>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Stack spacing={2}>
              <TextField
                fullWidth
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
              <TextField
                fullWidth
                label="Confirm Password"
                type={showPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
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
            </Stack>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
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
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(120deg, #2196f3 0%, #f50057 100%)',
        py: 4,
      }}
    >
      <Card
        component={motion.div}
        whileHover={{ scale: 1.02 }}
        sx={{
          p: 4,
          width: '100%',
          maxWidth: 600,
          borderRadius: 2,
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        }}
      >
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          Create Account
        </Typography>
        <Stepper activeStep={activeStep} sx={{ my: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <form onSubmit={handleSubmit}>
          {getStepContent(activeStep)}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              variant="outlined"
              sx={{ mr: 1 }}
            >
              Back
            </Button>
            <Button
              component={motion.button}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              variant="contained"
              disabled={!formData.role && activeStep === 0}
            >
              {activeStep === steps.length - 1 ? 'Sign Up' : 'Next'}
            </Button>
          </Box>
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

        <Typography align="center" sx={{ mt: 2 }} color="textSecondary">
          Already have an account?{' '}
          <Link
            to="/login"
            style={{
              color: '#2196f3',
              textDecoration: 'none',
              fontWeight: 500,
            }}
          >
            Login
          </Link>
        </Typography>
      </Card>
    </Box>
  );
};

export default Signup;