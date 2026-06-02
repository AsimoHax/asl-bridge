import React, { useRef, useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import { FilesetResolver, HandLandmarker, DrawingUtils } from '@mediapipe/tasks-vision';
import * as fp from "fingerpose";
import ASLAlphabet from "../utils/index";
import '../styles/Home.css';

// Initialize GestureEstimator once
const GE = new fp.GestureEstimator(ASLAlphabet);

const Home = () => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const handLandmarkerRef = useRef(null);

  const [prediction, setPrediction] = useState("Waiting");
  const [voteStats, setVoteStats] = useState({});
  const [translatedText, setTranslatedText] = useState('');
  const [letterHistory, setLetterHistory] = useState([]);
  const [cameraOn, setCameraOn] = useState(false);

  const gestureHistoryRef = useRef([]);
  const pinkyPathRef = useRef([]);
  const indexPathRef = useRef([]);
  const stableCountRef = useRef(0);
  const bestScoreRef = useRef(0);

  const BUFFER_SIZE = 30;

  // --- Real Camera Logic ---
  const createHandLandmarker = async () => {
    try {
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
      );
      handLandmarkerRef.current = await HandLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`,
          delegate: "GPU"
        },
        runningMode: "VIDEO",
        numHands: 1
      });
      renderLoop();
    } catch (err) {
      console.error("Model load failed:", err);
      setPrediction("Model load failed");
    }
  };

  const getMostFrequentGesture = (historyArray) => {
    if (historyArray.length === 0) return { mostFrequent: "Analyzing...", counts: {} };
    const counts = {};
    let maxCount = 0;
    let mostFrequent = "Analyzing...";
    for (const gesture of historyArray) {
      counts[gesture] = (counts[gesture] || 0) + 1;
      if (counts[gesture] > maxCount) {
        maxCount = counts[gesture];
        mostFrequent = gesture;
      }
    }
    return { mostFrequent, counts };
  };

  const isDrawingJCurve = (pathArray) => {
    if (pathArray.length < 15) return false;
    const startPoint = pathArray[0];
    const endPoint = pathArray[pathArray.length - 1];
    const deltaY = endPoint.y - startPoint.y;
    const deltaX = Math.abs(endPoint.x - startPoint.x);
    const THRESHOLD = 0.05;
    return (deltaY > THRESHOLD && deltaX > THRESHOLD);
  };

  const isDrawingZCurve = (pathArray) => {
    if (pathArray.length < 15) return false;
    let directionChanges = 0;
    let lastSign = 0;
    for (let i = 1; i < pathArray.length; i++) {
      let dx = pathArray[i].x - pathArray[i - 1].x;
      if (Math.abs(dx) > 0.005) {
        let sign = Math.sign(dx);
        if (lastSign !== 0 && sign !== lastSign) directionChanges++;
        lastSign = sign;
      }
    }
    return directionChanges >= 2;
  };

  const renderLoop = async () => {
    if (
      webcamRef.current &&
      webcamRef.current.video &&
      webcamRef.current.video.readyState === 4 &&
      handLandmarkerRef.current
    ) {
      const video = webcamRef.current.video;
      const results = await handLandmarkerRef.current.detectForVideo(video, performance.now());

      let handDetected = false;
      let fingerposeGesture = "None";

      if (results.landmarks && results.landmarks.length > 0 && results.landmarks[0]) {
        handDetected = true;
        const transformedLandmarks = results.landmarks[0].map(l => [l.x, l.y, l.z]);
        const pinkyTip = results.landmarks[0][20];
        const indexTip = results.landmarks[0][8];

        pinkyPathRef.current.push({ x: pinkyTip.x, y: pinkyTip.y });
        indexPathRef.current.push({ x: indexTip.x, y: indexTip.y });

        if (pinkyPathRef.current.length > BUFFER_SIZE) pinkyPathRef.current.shift();
        if (indexPathRef.current.length > BUFFER_SIZE) indexPathRef.current.shift();

        if (transformedLandmarks.length === 21) {
          const gesture = GE.estimate(transformedLandmarks, 8.5);
          if (gesture.gestures && gesture.gestures.length > 0) {
            const confidence = gesture.gestures.map((p) => p.score);
            const maxConfidence = confidence.indexOf(Math.max(...confidence));
            fingerposeGesture = gesture.gestures[maxConfidence].name;
            bestScoreRef.current = gesture.gestures[maxConfidence].score;
          }
        }
      }

      if (handDetected) {
        gestureHistoryRef.current.push(fingerposeGesture);
        if (gestureHistoryRef.current.length > BUFFER_SIZE) gestureHistoryRef.current.shift();

        let { mostFrequent, counts } = getMostFrequentGesture(gestureHistoryRef.current);

        if (mostFrequent === 'J' || mostFrequent === 'I') {
          mostFrequent = isDrawingJCurve(pinkyPathRef.current) ? "J" : "I";
        }
        if (mostFrequent === 'Z' || mostFrequent === 'D') {
          mostFrequent = isDrawingZCurve(indexPathRef.current) ? "Z" : "D";
        }

        setPrediction(mostFrequent);
        setVoteStats(counts);

        const conf = counts[mostFrequent] ? (counts[mostFrequent] / BUFFER_SIZE) : 0;
        if (mostFrequent.length === 1 && conf >= 0.7) {
          stableCountRef.current++;
          if (stableCountRef.current >= 90) {
            setTranslatedText(prev => prev + mostFrequent);
            setLetterHistory(prev => [...prev, mostFrequent]);
            stableCountRef.current = 0;
            gestureHistoryRef.current = [];
          }
        } else {
          stableCountRef.current = 0;
        }
      } else {
        if (gestureHistoryRef.current.length > 0) gestureHistoryRef.current.shift();
        pinkyPathRef.current = [];
        indexPathRef.current = [];
        stableCountRef.current = 0;
        bestScoreRef.current = 0;
        setPrediction("No Hand Detected");
        setVoteStats({});
      }

      if (canvasRef.current) {
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
    }

    requestAnimationFrame(renderLoop);
  };

  const handleStartCamera = () => {
    setCameraOn(true);
    createHandLandmarker();
  };

  const handleStopCamera = () => {
    setCameraOn(false);
    setPrediction("Waiting");
    setVoteStats({});
  };

  const handleCopy = () => {
    if (translatedText) {
      navigator.clipboard.writeText(translatedText);
    }
  };

  const handleDownload = () => {
    if (!translatedText) return;
    const blob = new Blob([translatedText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'asl-translation.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClearAll = () => {
    setTranslatedText('');
    setLetterHistory([]);
  };

  return (
    <div className="translator-page">
      {/* Header */}
      <header className="translator-header">
        <h1 className="translator-title">ASL to English Translator</h1>
        <p className="translator-subtitle">
          Real-time American Sign Language translation using your camera
        </p>
      </header>

      {/* Main 2-Column Grid */}
      <div className="translator-grid">
        {/* Left Column */}
        <div className="translator-left">
          {/* Block A: Camera Feed */}
          <div className="card camera-card">
            <div className="card-header">
              <h2 className="card-title">Camera Feed</h2>
              <div className="card-actions">
                {!cameraOn ? (
                  <button className="btn btn-start" onClick={handleStartCamera}>
                    <svg className="btn-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="23 7 16 12 23 17 23 7" />
                      <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                    </svg>
                    Start Camera
                  </button>
                ) : (
                  <button className="btn btn-stop" onClick={handleStopCamera}>
                    <svg className="btn-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    </svg>
                    Stop Camera
                  </button>
                )}
              </div>
            </div>

            {/* Video Area */}
            <div className="camera-viewport">
              {cameraOn ? (
                <>
                  <Webcam
                    ref={webcamRef}
                    mirrored={true}
                    className="camera-video"
                  />
                  <canvas
                    ref={canvasRef}
                    width="640"
                    height="480"
                    className="camera-overlay-canvas"
                  />
                  {/* Live prediction overlay */}
                  {prediction && prediction !== "Waiting" && prediction !== "No Hand Detected" && (
                    <div className="live-prediction-badge">
                      {prediction}
                    </div>
                  )}
                </>
              ) : (
                <div className="camera-off-state">
                  <div className="camera-off-icon">
                    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                      <circle cx="24" cy="24" r="22" stroke="#475569" strokeWidth="2" strokeDasharray="4 4" />
                      <text x="24" y="30" textAnchor="middle" fill="#94A3B8" fontSize="24" fontWeight="700" fontFamily="Inter, sans-serif">!</text>
                    </svg>
                  </div>
                  <p className="camera-off-title">Camera is off</p>
                  <p className="camera-off-sub">Click 'Start Camera' to begin</p>
                </div>
              )}
            </div>
          </div>

          {/* Block B: How to Use */}
          <div className="card how-to-card">
            <h2 className="card-title">How to Use</h2>
            <ol className="how-to-list">
              <li>
                <span className="step-number">1</span>
                <span className="step-text">Click "Start Camera" to enable your webcam</span>
              </li>
              <li>
                <span className="step-number">2</span>
                <span className="step-text">Position your hand clearly in front of the camera</span>
              </li>
              <li>
                <span className="step-number">3</span>
                <span className="step-text">Watch the translation appear in real-time</span>
              </li>
            </ol>
          </div>
        </div>

        {/* Right Column */}
        <div className="translator-right">
          {/* Block C: Translation */}
          <div className="card translation-card">
            <div className="translation-header">
              <h2 className="card-title">Translation</h2>
              <div className="translation-actions">
                {/* Copy */}
                <button className="action-btn" onClick={handleCopy} title="Copy to clipboard">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                </button>
                {/* Download */}
                <button className="action-btn" onClick={handleDownload} title="Download as text">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                </button>
                {/* Delete/Clear */}
                <button className="action-btn action-btn-danger" onClick={handleClearAll} title="Clear all">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="translation-content">
              {/* Main Output Box */}
              <div className="translation-output-box">
                {translatedText ? (
                  <p className="translated-output">{translatedText.split('').join(' ')}</p>
                ) : (
                  <div className="translation-empty">
                    <svg className="empty-icon" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#CBD5E1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                    <p className="empty-title">No translation yet</p>
                    <p className="empty-sub">Detected signs will appear here</p>
                  </div>
                )}
              </div>

              {/* Word History */}
              {letterHistory.length > 0 && (
                <div className="word-history">
                  <div className="word-history-divider"></div>
                  <p className="word-history-title">Word History</p>
                  <div className="word-history-badges">
                    {letterHistory.map((letter, index) => (
                      <span key={index} className="history-badge">{letter}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;