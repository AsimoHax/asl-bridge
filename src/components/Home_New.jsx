import React, { useRef, useEffect , useState} from 'react';
import Webcam from 'react-webcam';
import { FilesetResolver, HandLandmarker, FaceLandmarker, DrawingUtils } from '@mediapipe/tasks-vision';
import * as fp from "fingerpose";
import ASLAlphabet from "../utils/index";

const Home = () => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  
  const handLandmarkerRef = useRef(null);
  const faceLandmarkerRef = useRef(null);
  
  const [prediction, setPrediction] = useState("Waiting");
  const [isModelLoaded, setIsModelLoaded] = useState(false);

  // 1. Khởi tạo Model - Nâng cấp lên nhận diện 2 tay
  const createModels = async () => {
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
        numHands: 2 
      });

      // Nhận diện khuôn mặt
      faceLandmarkerRef.current = await FaceLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task`,
          delegate: "GPU"
        },
        runningMode: "VIDEO",
        outputFaceBlendshapes: false,
        outputFacialTransformationMatrixes: false
      });

      setIsModelLoaded(true);
      setPrediction("Ready");
    } catch (error) {
      console.error("Lỗi khởi tạo bộ mô hình MediaPipe:", error);
      setPrediction("Model Load Failed");
    }
  };

  const calculateDistance = (p1, p2) => {
    return Math.sqrt(
      Math.pow(p1.x - p2.x, 2) + 
      Math.pow(p1.y - p2.y, 2) + 
          Math.pow(p1.z - p2.z, 2)
    );
  };

  // 2. Vòng lặp xử lý hình ảnh ổn định
  useEffect(() => {
    if (!isModelLoaded) return;

    let active = true;

    const renderLoop = async () => {
      if (!active) return;

      if (
        webcamRef.current && 
        webcamRef.current.video && 
        webcamRef.current.video.readyState === 4 &&
        handLandmarkerRef.current &&
        faceLandmarkerRef.current
      ) {
        const video = webcamRef.current.video;
        const timestamp = performance.now();

        try {
          // Kéo dữ liệu song song từ cả hai cảm biến
          const [handResults, faceResults] = await Promise.all([
            handLandmarkerRef.current.detectForVideo(video, timestamp),
            faceLandmarkerRef.current.detectForVideo(video, timestamp)
          ]);

          let handDetected = false;
          let fingerposeGesture = "None";
          let isNearCheek = false;

          // --- BƯỚC 1: XỬ LÝ KHUNG TAY (Duyệt qua tất cả các tay phát hiện được) ---
          if (handResults.landmarks && handResults.landmarks.length > 0) {
            handDetected = true;
            
            // Ưu tiên xử lý bàn tay đầu tiên di chuyển để nhận diện cử chỉ fingerpose
            const primaryHand = handResults.landmarks[0];
            const transformedLandmarks = primaryHand.map(l => [l.x, l.y, l.z]);

            if (transformedLandmarks.length === 21) {
              const GE = new fp.GestureEstimator(ASLAlphabet);
              const gesture = await GE.estimate(transformedLandmarks, 7.5);

              if (gesture.gestures && gesture.gestures.length > 0) {
                const confidence = gesture.gestures.map((p) => p.score);
                const maxConfidence = confidence.indexOf(Math.max(...confidence));
                fingerposeGesture = gesture.gestures[maxConfidence].name; 
              }
            }

            // --- BƯỚC 2: XỬ LÝ VỊ TRÍ TƯƠNG QUAN MÁ (Quét dựa trên tay chính) ---
            if (faceResults.faceLandmarks && faceResults.faceLandmarks.length > 0) {
              const facePoints = faceResults.faceLandmarks[0]; 

              const handCheckPoint = primaryHand[4]; // Đầu ngón cái
              const rightCheek = facePoints[205];   // Má phải trên lưới FaceMesh
              const leftCheek = facePoints[425];    // Má trái trên lưới FaceMesh

              if (handCheckPoint && rightCheek && leftCheek) {
                const distToRightCheek = calculateDistance(handCheckPoint, rightCheek);
                const distToLeftCheek = calculateDistance(handCheckPoint, leftCheek);

                // Ngưỡng phát hiện khoảng cách áp má
                const EPSILON = 0.14; 

                if (distToRightCheek < EPSILON || distToLeftCheek < EPSILON) {
                  isNearCheek = true;
                }
              }
            }
          }

          // --- BƯỚC 3: KẾT LUẬN ĐẦU RA CHO SẢN PHẨM ---
          if (handDetected) {
            if ((fingerposeGesture === 'apple' || fingerposeGesture === 'A') && isNearCheek) {
              setPrediction("APPLE 🍎");
            } else {
              setPrediction(fingerposeGesture); 
            }
          } else {
            setPrediction("No Hand Detected");
          }

          // --- BƯỚC 4: VẼ LAYER ĐỒ HỌA CHUẨN XÁC ---
          if (canvasRef.current) {
            const canvasCtx = canvasRef.current.getContext("2d");
            const drawingUtils = new DrawingUtils(canvasCtx);
            
            canvasCtx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
            canvasCtx.save();
            
            // Xử lý đồng bộ hóa việc lật gương chính xác cho cả xương mặt và xương tay
            canvasCtx.translate(canvasRef.current.width, 0);
            canvasCtx.scale(-1, 1);

            // Vẽ toàn bộ các bàn tay được phát hiện (Hỗ trợ hiển thị cả 2 tay cùng lúc)
            if (handResults.landmarks && handResults.landmarks.length > 0) {
              for (const landmarks of handResults.landmarks) {
                drawingUtils.drawConnectors(landmarks, HandLandmarker.HAND_CONNECTIONS, {
                  color: "#00FF00",
                  lineWidth: 4
                });
                drawingUtils.drawLandmarks(landmarks, { color: "#FF0000", lineWidth: 1 });
              }
            }

            // Ép buộc hệ thống vẽ điểm định vị lưới mặt rõ ràng hơn
            if (faceResults.faceLandmarks && faceResults.faceLandmarks.length > 0) {
              for (const landmarks of faceResults.faceLandmarks) {
                // Sử dụng drawLandmarks để chấm điểm mảnh lên mặt thay vì vẽ lưới kết nối bị lỗi
                drawingUtils.drawLandmarks(landmarks, {
                  color: "rgba(0, 255, 255, 0.3)", // Chấm màu xanh neon mờ nhìn rất công nghệ
                  lineWidth: 0.3
                });
              }
            }
            canvasCtx.restore();
          }

        } catch (err) {
          console.error("Lỗi luồng đồ họa:", err);
        }
      }

      if (active) {
        requestAnimationFrame(renderLoop);
      }
    };

    requestAnimationFrame(renderLoop);

    return () => {
      active = false;
    };
  }, [isModelLoaded]);

  useEffect(() => {
    createModels();
  }, []);

  return (
    <div style={{ position: 'relative', width: '640px', margin: 'auto' }}>
      <Webcam ref={webcamRef} mirrored={true} style={{ width: '640px', height: '480px', borderRadius: '10px' }} />
      <canvas ref={canvasRef} width="640" height="480" style={{ position: 'absolute', top: 0, left: 0 }} />

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
        border: '2px solid #00FF00',
        whiteSpace: 'nowrap'
      }}>
        {prediction}
      </div>
    </div>
  );
};

export default Home;