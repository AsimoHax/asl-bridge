import React, { useRef, useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import { FilesetResolver, HandLandmarker, FaceLandmarker, DrawingUtils } from '@mediapipe/tasks-vision';
import * as fp from "fingerpose";
import ASLAlphabet from "../utils/index";
import '../styles/Home.css';

// Khởi tạo GestureEstimator 1 lần duy nhất
const GE = new fp.GestureEstimator(ASLAlphabet);

const Home = () => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  const handLandmarkerRef = useRef(null);

  const [prediction, setPrediction] = useState("Waiting");
  const [voteStats, setVoteStats] = useState({});

  const gestureHistoryRef = useRef([]);

  // --- Mảng lưu tọa độ quỹ đạo ngón tay ---
  const pinkyPathRef = useRef([]); // Lưu tọa độ ngón út (cho chữ J)
  const indexPathRef = useRef([]); // Lưu tọa độ ngón trỏ (cho chữ Z)

  const BUFFER_SIZE = 30; // ~1 giây quét

  const createHandLandmarker = async () => {
    try {
      setPrediction("Loading Models...");
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
      );

      // Nhận diện tối đa 2 tay
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

  // --- Hàm kiểm tra quỹ đạo chữ J ---
  const isDrawingJCurve = (pathArray) => {
    if (pathArray.length < 15) return false;
    const startPoint = pathArray[0];
    const endPoint = pathArray[pathArray.length - 1];
    const deltaY = endPoint.y - startPoint.y;
    const deltaX = Math.abs(endPoint.x - startPoint.x);
    const THRESHOLD = 0.05;
    return (deltaY > THRESHOLD && deltaX > THRESHOLD);
  };

  // --- Hàm kiểm tra quỹ đạo chữ Z ---
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
      let isNearCheek = false;

      // --- 1. DETECTION LOGIC ---
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
            currentFrameGesture = gesture.gestures[maxConfidence].name;
          }
        }
      }

      // --- 2. VOTING BUFFER & MOTION TRACKING ---
      if (handDetected) {
        gestureHistoryRef.current.push(currentFrameGesture);
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
      } else {
        if (gestureHistoryRef.current.length > 0) gestureHistoryRef.current.shift();
        pinkyPathRef.current = [];
        indexPathRef.current = [];
        setPrediction("No Hand Detected");
        setVoteStats({});
      }

      // --- 3. DRAWING LOGIC ---
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

    return () => {
      active = false;
    };
  }, [isModelLoaded]);

  useEffect(() => {
    createModels();
  }, []);

  // Determine status label
  const isDetecting = prediction !== "Waiting" && prediction !== "No Hand Detected";
  const statusClass = prediction === "No Hand Detected"
    ? "status-none"
    : prediction === "Waiting"
      ? "status-waiting"
      : "status-active";

  return (
    <div className="home-page">
      {/* Header */}
      <div className="home-header">
        <div className="home-header-badge">Live Detection</div>
        <h1 className="home-title">ASL Recognition</h1>
        <p className="home-subtitle">
          Position your hand in front of the camera. The AI will detect your sign in real time.
        </p>
      </div>

      {/* Main content */}
      <div className="home-content">

        {/* Camera block */}
        <div className="camera-wrapper">
          {/* Glow ring */}
          <div className={`camera-glow ${isDetecting ? 'glow-active' : ''}`} />

          <div className="camera-container">
            <Webcam
              ref={webcamRef}
              mirrored={true}
              className="camera-feed"
            />
            <canvas
              ref={canvasRef}
              width="640"
              height="480"
              className="camera-canvas"
            />

            {/* Prediction badge */}
            <div className={`prediction-badge ${statusClass}`}>
              <span className="prediction-letter">{prediction}</span>
            </div>

            {/* Corner decorations */}
            <div className="corner corner-tl" />
            <div className="corner corner-tr" />
            <div className="corner corner-bl" />
            <div className="corner corner-br" />
          </div>

          {/* Status pill */}
          <div className={`camera-status-pill ${statusClass}`}>
            <span className="status-dot" />
            {prediction === "No Hand Detected"
              ? "No hand in frame"
              : prediction === "Waiting"
                ? "Initializing model…"
                : `Detected: ${prediction}`}
          </div>
        </div>

        {/* Sidebar stats */}
        <div className="stats-panel">
          <div className="stats-header">
            <span className="stats-icon">📊</span>
            <div>
              <div className="stats-title">Frame Analysis</div>
              <div className="stats-subtitle">Last {BUFFER_SIZE} frames</div>
            </div>
          </div>

          <div className="stats-divider" />

          <ul className="stats-list">
            {Object.keys(voteStats).length === 0 ? (
              <li className="stats-empty">
                <span className="stats-empty-icon">👋</span>
                <span>Show your hand to start</span>
              </li>
            ) : (
              Object.entries(voteStats)
                .sort((a, b) => b[1] - a[1])
                .map(([gesture, count]) => {
                  const pct = Math.round((count / BUFFER_SIZE) * 100);
                  const isWinner = gesture === prediction;
                  return (
                    <li key={gesture} className={`stats-item ${isWinner ? 'stats-item-winner' : ''}`}>
                      <div className="stats-item-top">
                        <span className={`stats-gesture ${isWinner ? 'gesture-winner' : ''}`}>
                          {isWinner && <span className="winner-dot" />}
                          {gesture}
                        </span>
                        <span className="stats-count">{count}<span className="stats-of">/{BUFFER_SIZE}</span></span>
                      </div>
                      <div className="stats-bar-track">
                        <div
                          className={`stats-bar-fill ${isWinner ? 'bar-winner' : ''}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </li>
                  );
                })
            )}
          </ul>

          {/* Current prediction summary */}
          {isDetecting && (
            <div className="stats-result">
              <div className="stats-result-label">Current Prediction</div>
              <div className="stats-result-letter">{prediction}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;