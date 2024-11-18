import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Webcam from 'react-webcam';
import { 
  Box, 
  Button, 
  Container, 
  Typography, 
  Paper,
  Grid,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert
} from '@mui/material';
import styled from 'styled-components';

const StudentPortal = () => {
  const [showCamera, setShowCamera] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isFaceRegistered, setIsFaceRegistered] = useState(false);
  const [showRegistrationDialog, setShowRegistrationDialog] = useState(false);
  const [registrationData, setRegistrationData] = useState({
    studentId: '',
    name: '',
    faceImage: null
  });
  const [registrationStatus, setRegistrationStatus] = useState('');
  const webcamRef = useRef(null);
  const navigate = useNavigate();

  const handleRegistrationOpen = () => {
    setShowRegistrationDialog(true);
  };

  const handleRegistrationClose = () => {
    setShowRegistrationDialog(false);
    setShowCamera(false);
  };

  const handleInputChange = (e) => {
    setRegistrationData({
      ...registrationData,
      [e.target.name]: e.target.value
    });
  };

  const capturePhoto = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setRegistrationData({
      ...registrationData,
      faceImage: imageSrc
    });
    return imageSrc;
  };

  const handleFaceRegistration = async () => {
    setIsProcessing(true);
    const imageSrc = capturePhoto();

    // Simulate sending data to backend
    try {
      // Here you would typically:
      // 1. Send the image and student data to your backend
      // 2. Process and store the face embedding
      // 3. Associate it with the student ID
      
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setIsFaceRegistered(true);
      setRegistrationStatus('success');
      setIsProcessing(false);
      
      // Store registration status in localStorage (in real app, use proper auth)
      localStorage.setItem('faceRegistered', 'true');
      localStorage.setItem('studentId', registrationData.studentId);
      
    } catch (error) {
      console.error('Registration error:', error);
      setRegistrationStatus('error');
      setIsProcessing(false);
    }
  };

  const handleFaceLogin = async () => {
    setIsProcessing(true);
    const imageSrc = capturePhoto();

    try {
      // Here you would typically:
      // 1. Send the captured image to your backend
      // 2. Compare it with stored face embedding
      // 3. Verify the user's identity

      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setIsProcessing(false);
      navigate('/choose'); // Redirect after successful verification
      
    } catch (error) {
      console.error('Login error:', error);
      setIsProcessing(false);
    }
  };

  return (
    <StyledContainer>
      <Paper elevation={3} sx={{ padding: 4, maxWidth: 800, width: '100%' }}>
        {!showCamera ? (
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h3" component="h1" gutterBottom sx={{ color: '#2c3e50', fontWeight: 'bold' }}>
              Student Management Portal
            </Typography>
            
            <Grid container spacing={4} sx={{ mt: 4 }}>
              <Grid item xs={12} md={6}>
                <FeatureCard>
                  <Typography variant="h6" gutterBottom>
                    Face Recognition
                  </Typography>
                  <Typography>
                    Secure login using advanced facial recognition technology
                  </Typography>
                </FeatureCard>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FeatureCard>
                  <Typography variant="h6" gutterBottom>
                    Easy Registration
                  </Typography>
                  <Typography>
                    Quick and simple face registration process
                  </Typography>
                </FeatureCard>
              </Grid>
            </Grid>

            <Box sx={{ mt: 6, display: 'flex', justifyContent: 'center', gap: 2 }}>
              {!isFaceRegistered ? (
                <Button
                  variant="contained"
                  size="large"
                  onClick={handleRegistrationOpen}
                  sx={{
                    bgcolor: '#7f56da',
                    '&:hover': { bgcolor: '#6941c6' },
                    px: 4,
                    py: 1.5
                  }}
                >
                  Register Face
                </Button>
              ) : (
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => setShowCamera(true)}
                  sx={{
                    bgcolor: '#7f56da',
                    '&:hover': { bgcolor: '#6941c6' },
                    px: 4,
                    py: 1.5
                  }}
                >
                  Face Login
                </Button>
              )}
              <Button
                variant="outlined"
                size="large"
                href="/choose"
                sx={{
                  color: '#7f56da',
                  borderColor: '#7f56da',
                  '&:hover': { borderColor: '#6941c6' },
                  px: 4,
                  py: 1.5
                }}
              >
                Traditional Login
              </Button>
            </Box>
          </Box>
        ) : (
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h5" gutterBottom>
              Face Recognition Login
            </Typography>
            <Box sx={{ mt: 2, mb: 4 }}>
              <Webcam
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                style={{
                  width: '100%',
                  maxWidth: '400px',
                  borderRadius: '8px'
                }}
              />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
              <Button
                variant="contained"
                onClick={handleFaceLogin}
                disabled={isProcessing}
                sx={{
                  bgcolor: '#7f56da',
                  '&:hover': { bgcolor: '#6941c6' }
                }}
              >
                {isProcessing ? (
                  <>
                    <CircularProgress size={24} sx={{ mr: 1, color: 'white' }} />
                    Verifying...
                  </>
                ) : (
                  'Verify & Login'
                )}
              </Button>
              <Button
                variant="outlined"
                onClick={() => setShowCamera(false)}
                sx={{
                  color: '#7f56da',
                  borderColor: '#7f56da'
                }}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        )}

        {/* Face Registration Dialog */}
        <Dialog 
          open={showRegistrationDialog} 
          onClose={handleRegistrationClose}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Face Registration</DialogTitle>
          <DialogContent>
            <Box sx={{ mb: 2 }}>
              <TextField
                name="studentId"
                label="ID"
                fullWidth
                margin="normal"
                value={registrationData.studentId}
                onChange={handleInputChange}
              />
              <TextField
                name="name"
                label="Full Name"
                fullWidth
                margin="normal"
                value={registrationData.name}
                onChange={handleInputChange}
              />
            </Box>
            
            {showCamera && (
              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <Webcam
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  style={{
                    width: '100%',
                    maxWidth: '400px',
                    borderRadius: '8px'
                  }}
                />
              </Box>
            )}

            {registrationStatus === 'success' && (
              <Alert severity="success" sx={{ mt: 2 }}>
                Face registered successfully! You can now use face login.
              </Alert>
            )}

            {registrationStatus === 'error' && (
              <Alert severity="error" sx={{ mt: 2 }}>
                Registration failed. Please try again.
              </Alert>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            {!showCamera ? (
              <Button 
                onClick={() => setShowCamera(true)}
                variant="contained"
                sx={{ bgcolor: '#7f56da', '&:hover': { bgcolor: '#6941c6' } }}
              >
                Start Camera
              </Button>
            ) : (
              <>
                <Button 
                  onClick={handleFaceRegistration}
                  variant="contained"
                  disabled={isProcessing || !registrationData.studentId || !registrationData.name}
                  sx={{ bgcolor: '#7f56da', '&:hover': { bgcolor: '#6941c6' } }}
                >
                  {isProcessing ? (
                    <>
                      <CircularProgress size={24} sx={{ mr: 1, color: 'white' }} />
                      Registering...
                    </>
                  ) : (
                    'Register Face'
                  )}
                </Button>
                <Button onClick={() => setShowCamera(false)}>
                  Cancel
                </Button>
              </>
            )}
          </DialogActions>
        </Dialog>
      </Paper>
    </StyledContainer>
  );
};



// Styled Components
const StyledContainer = styled(Container)`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e7ec 100%);
  padding: 120px;
`;

const FeatureCard = styled(Paper)`
  padding: 24px;
  height: 100%;
  text-align: center;
  background: #ffffff;
  transition: transform 0.2s ease-in-out;
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0,0,0,0.1);
  }
`;

export default StudentPortal;