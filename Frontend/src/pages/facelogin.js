import React, { useRef, useEffect, useState } from 'react';
import * as faceapi from 'face-api.js';
import { useNavigate } from 'react-router-dom';

const FaceLogin = () => {
  const videoRef = useRef();
  const canvasRef = useRef();
  const [isRecognized, setIsRecognized] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = '/models';
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
      ]);
    };

    loadModels();
    startVideo();
  }, []);

  const startVideo = () => {
    navigator.mediaDevices.getUserMedia({ video: {} })
      .then(stream => {
        videoRef.current.srcObject = stream;
      })
      .catch(err => console.error(err));
  };

  const handleVideoOnPlay = () => {
    setInterval(async () => {
      if (videoRef.current) {
        const detections = await faceapi.detectAllFaces(videoRef.current, 
          new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptors();
        
        canvasRef.current.innerHtml = faceapi.createCanvasFromMedia(videoRef.current);
        faceapi.matchDimensions(canvasRef.current, { width: 640, height: 480 });

        const resizedDetections = faceapi.resizeResults(detections, { width: 640, height: 480 });

        faceapi.draw.drawDetections(canvasRef.current, resizedDetections);
        faceapi.draw.drawFaceLandmarks(canvasRef.current, resizedDetections);

        if (detections.length > 0) {
          // Here you would typically compare the detected face with a database of known faces
          // For this example, we'll just consider any detected face as recognized
          setIsRecognized(true);
          setTimeout(() => {
            navigate('/dashboard'); // Redirect to dashboard after successful recognition
          }, 2000);
        }
      }
    }, 100);
  };

  return (
    <div>
      <video ref={videoRef} autoPlay muted onPlay={handleVideoOnPlay} />
      <canvas ref={canvasRef} />
      {isRecognized && <p>Face recognized! Redirecting...</p>}
    </div>
  );
};

export default FaceLogin;