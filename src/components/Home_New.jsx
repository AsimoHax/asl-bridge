import React, { useRef, useEffect , useState } from 'react';
import Webcam from 'react-webcam';
import { FilesetResolver, HandLandmarker, DrawingUtils } from '@mediapipe/tasks-vision';
import * as fp from "fingerpose";
import ASLAlphabet from "../utils/index";

// Khởi tạo GestureEstimator 1 lần duy nhất
const GE = new fp.GestureEstimator(ASLAlphabet);

const Home = () => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const handLandmarkerRef = useRef(null);
  
  const [prediction, setPrediction] = useState("Waiting");
  const [voteStats, setVoteStats] = useState({});

  const gestureHistoryRef = useRef([]);
  
  // --- THÊM MỚI: Mảng lưu tọa độ quỹ đạo ngón tay ---
  const pinkyPathRef = useRef([]); // Lưu tọa độ ngón út (cho chữ J)
  const indexPathRef = useRef([]); // Lưu tọa độ ngón trỏ (cho chữ Z)
  
  const BUFFER_SIZE = 30; // ~1 giây quét

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

  // --- THÊM MỚI: Hàm kiểm tra quỹ đạo chữ J (Ngón út vuốt xuống và móc) ---
  const isDrawingJCurve = (pathArray) => {
    if (pathArray.length < 15) return false;

    const startPoint = pathArray[0];
    const endPoint = pathArray[pathArray.length - 1];

    // Trục Y tăng nghĩa là tay đang đi xuống
    const deltaY = endPoint.y - startPoint.y;
    // Trục X thay đổi nghĩa là tay móc sang ngang
    const deltaX = Math.abs(endPoint.x - startPoint.x);

    const THRESHOLD = 0.05; // Cần di chuyển ít nhất 5% khung hình để tính là có vẽ

    return (deltaY > THRESHOLD && deltaX > THRESHOLD);
  };

  // --- THÊM MỚI: Hàm kiểm tra quỹ đạo chữ Z (Ngón trỏ vẽ Zigzag) ---
  const isDrawingZCurve = (pathArray) => {
    if (pathArray.length < 15) return false;

    let directionChanges = 0;
    let lastSign = 0;

    // Đếm số lần đổi hướng theo trục ngang (Trái -> Phải -> Trái)
    for(let i = 1; i < pathArray.length; i++) {
        let dx = pathArray[i].x - pathArray[i-1].x;
        // Bỏ qua các rung lắc nhỏ của tay
        if (Math.abs(dx) > 0.005) {
            let sign = Math.sign(dx);
            if (lastSign !== 0 && sign !== lastSign) {
                directionChanges++;
            }
            lastSign = sign;
        }
    }
    // Một hình Z chuẩn sẽ có ít nhất 2 lần đổi hướng ngang
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
      let currentFrameGesture = "Analyzing...";

      // --- 1. THE AI DETECTION LOGIC ---
      if (results.landmarks && results.landmarks.length > 0 && results.landmarks[0]) {
        handDetected = true;
        const transformedLandmarks = results.landmarks[0].map(l => [l.x, l.y, l.z]);

        // Trích xuất tọa độ ngón út (số 20) và ngón trỏ (số 8)
        const pinkyTip = results.landmarks[0][20];
        const indexTip = results.landmarks[0][8];

        // Đẩy tọa độ vào buffer theo dõi quỹ đạo
        pinkyPathRef.current.push({ x: pinkyTip.x, y: pinkyTip.y });
        indexPathRef.current.push({ x: indexTip.x, y: indexTip.y });

        // Giữ mảng ở kích thước chuẩn
        if (pinkyPathRef.current.length > BUFFER_SIZE) pinkyPathRef.current.shift();
        if (indexPathRef.current.length > BUFFER_SIZE) indexPathRef.current.shift();

        if (transformedLandmarks.length === 21) {
          const gesture = GE.estimate(transformedLandmarks, 8.0);
          if (gesture.gestures && gesture.gestures.length > 0) {
            const confidence = gesture.gestures.map((p) => p.score);
            const maxConfidence = confidence.indexOf(Math.max(...confidence));
            currentFrameGesture = gesture.gestures[maxConfidence].name;
          }
        }
      }

      // --- 2. LOGIC ĐẾM FRAME (VOTING BUFFER) & MOTION TRACKING ---
      if (handDetected) {
        gestureHistoryRef.current.push(currentFrameGesture);

        if (gestureHistoryRef.current.length > BUFFER_SIZE) {
          gestureHistoryRef.current.shift(); 
        }

        let { mostFrequent, counts } = getMostFrequentGesture(gestureHistoryRef.current);
        
        // -------------------------------------------------------------
        // LỚP LỌC MOTION TRACKING: Ép kết quả nếu phát hiện quỹ đạo vẽ
        // -------------------------------------------------------------
        // Xử lý tranh chấp I và J (Cùng dáng ngón út)
        if (mostFrequent === 'J' || mostFrequent === 'I') {
            if (isDrawingJCurve(pinkyPathRef.current)) {
                mostFrequent = "J"; 
            } else {
                mostFrequent = "I";
            }
        }
        
        // Xử lý tranh chấp D và Z (Cùng dáng ngón trỏ giơ lên - Có thể thay 'D' bằng '1' tùy bộ từ điển của bạn)
        if (mostFrequent === 'Z' || mostFrequent === 'D') {
            if (isDrawingZCurve(indexPathRef.current)) {
                mostFrequent = "Z";
            } else {
                mostFrequent = "D";
            }
        }
        // -------------------------------------------------------------

        setPrediction(mostFrequent);
        setVoteStats(counts); 

      } else {
        // Dọn dẹp sạch sẽ các mảng lịch sử khi hạ tay xuống
        if (gestureHistoryRef.current.length > 0) gestureHistoryRef.current.shift();
        pinkyPathRef.current = [];
        indexPathRef.current = [];

        setPrediction("No Hand Detected");
        setVoteStats({}); 
      }

      // --- 3. THE DRAWING LOGIC ---
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

  useEffect(() => {
    createHandLandmarker();
  }, []);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', gap: '20px', padding: '20px', backgroundColor: '#121212', minHeight: '100vh' }}>
      
      {/* KHỐI 1: CAMERA */}
      <div style={{ position: 'relative', width: '640px', height: '480px' }}>
        <Webcam ref={webcamRef} mirrored={true} style={{ width: '640px', height: '480px', borderRadius: '10px' }} />
        <canvas ref={canvasRef} width="640" height="480" style={{ position: 'absolute', top: 0, left: 0 }} />

        <div style={{
          position: 'absolute',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
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

      {/* KHỐI 2: SIDEBAR LIỆT KÊ THỐNG KÊ ĐẾM FRAME */}
      <div style={{
        width: '280px',
        height: '480px',
        backgroundColor: '#1e1e1e',
        borderRadius: '10px',
        padding: '20px',
        boxSizing: 'border-box',
        color: 'white',
        boxShadow: '0 4px 10px rgba(0,0,0,0.5)',
        overflowY: 'auto'
      }}>
        <h3 style={{ marginTop: 0, borderBottom: '2px solid #333', paddingBottom: '10px', textAlign: 'center' }}>
          📊 Phân tích Bộ đếm
        </h3>
        
        <p style={{ fontSize: '0.85rem', color: '#aaa', textAlign: 'center' }}>
          Ghi nhận trong 30 frames gần nhất
        </p>

        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {Object.keys(voteStats).length === 0 ? (
            <li style={{ textAlign: 'center', color: '#666', marginTop: '20px' }}>Chưa có dữ liệu...</li>
          ) : (
            Object.entries(voteStats)
              .sort((a, b) => b[1] - a[1])
              .map(([gesture, count]) => (
                <li 
                  key={gesture} 
                  style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    padding: '12px 10px', 
                    borderBottom: '1px solid #333',
                    backgroundColor: gesture === prediction ? 'rgba(0, 255, 0, 0.15)' : 'transparent',
                    borderRadius: '5px',
                    marginBottom: '5px'
                  }}
                >
                  <span style={{ 
                    fontWeight: 'bold', 
                    fontSize: '1.2rem',
                    color: gesture === prediction ? '#00FF00' : '#fff' 
                  }}>
                    {gesture}
                  </span>
                  <span style={{ backgroundColor: '#333', padding: '4px 10px', borderRadius: '20px', fontSize: '0.9rem' }}>
                    {count} / 30
                  </span>
                </li>
              ))
          )}
        </ul>
      </div>

    </div>
  );
};

export default Home;