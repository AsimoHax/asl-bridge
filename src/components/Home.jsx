import React, { useRef, useEffect , useState} from 'react';
import Webcam from 'react-webcam';
import { FilesetResolver, HandLandmarker, DrawingUtils } from '@mediapipe/tasks-vision';
import { detectASL } from '../utils/aslLogic';
import * as fp from "fingerpose";
import ASLAlphabet from "../utils/index";


const Home = () => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  let handLandmarker = undefined;
  const [prediction, setPrediction] = useState("Waiting");

  // 1. Load the MediaPipe Model
  const createHandLandmarker = async () => {
    const vision = await FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
    );
    handLandmarker = await HandLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath: `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`,
        delegate: "GPU"
      },
      runningMode: "VIDEO",
      numHands: 2
    });
    renderLoop();
  };

  // 2. The Animation Loop (Detects hand every frame)
  const renderLoop = async () => {
  if (webcamRef.current && webcamRef.current.video.readyState === 4) {
    const video = webcamRef.current.video;
    const results = await handLandmarker.detectForVideo(video, performance.now());

    // --- 1. THE AI DETECTION LOGIC ---
if (results.landmarks && results.landmarks.length > 0 && results.landmarks[0]) {
  
  // Transform landmarks for fingerpose: [[x,y,z], [x,y,z]...]
  // We use results.landmarks[0] for the first hand found
  const transformedLandmarks = results.landmarks[0].map(l => [l.x, l.y, l.z]);

  // IMPORTANT: Ensure the array has exactly 21 points before estimating
  if (transformedLandmarks.length === 21) {
    const GE = new fp.GestureEstimator(ASLAlphabet);
    
    // Estimate needs the landmarks array and a confidence threshold
    const gesture = await GE.estimate(transformedLandmarks, 8.0);

    if (gesture.gestures && gesture.gestures.length > 0) {
      const confidence = gesture.gestures.map((p) => p.score);
      const maxConfidence = confidence.indexOf(Math.max(...confidence));
      const result = gesture.gestures[maxConfidence].name;
      setPrediction(result); 
    } else {
      setPrediction("Analyzing...");
    }
  }
} else {
  setPrediction("No Hand Detected");
}

    // --- 2. THE DRAWING LOGIC ---
    const canvasCtx = canvasRef.current.getContext("2d");
    const drawingUtils = new DrawingUtils(canvasCtx);
    
    canvasCtx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    canvasCtx.save();
    canvasCtx.translate(canvasRef.current.width, 0);
    canvasCtx.scale(-1, 1);

    if (results.landmarks && results.landmarks.length > 0) {
      for (const landmarks of results.landmarks) {
        drawingUtils.drawConnectors(landmarks, HandLandmarker.HAND_CONNECTIONS, {
          color: "#00FF00",
          lineWidth: 5
        });
        drawingUtils.drawLandmarks(landmarks, { color: "#FF0000", lineWidth: 2 });
      }
    }
    
    canvasCtx.restore();
  }
  requestAnimationFrame(renderLoop);
};

  useEffect(() => {
    createHandLandmarker();
  }, []);

  return (
    <div style={{ position: 'relative', width: '640px', margin: 'auto' }}>
      {/* 1. The Video Layer */}
      <Webcam ref={webcamRef} mirrored={true} style={{ width: '640px', height: '480px', borderRadius: '10px' }} />
      
      {/* 2. The Skeleton Layer */}
      <canvas ref={canvasRef} width="640" height="480" style={{ position: 'absolute', top: 0, left: 0 }} />

      {/* 3. The Prediction Overlay */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        color: 'white',
        padding: '10px 40px',
        borderRadius: '50px',
        fontSize: '2rem',
        fontWeight: 'bold',
        border: '2px solid #00FF00'
      }}>
        {prediction}
      </div>
    </div>
  );
};

export default Home;