import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';

const Home = () => {
  const webcamRef = useRef(null);
  const [cameraEnabled, setCameraEnabled] = useState(true);

  // Styling for the webcam container
  const videoConstraints = {
    width: 640,
    height: 480,
    facingMode: "user",
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px' }}>
      <h2>ASL Real-Time Detection</h2>
      
      <div style={{ position: 'relative', borderRadius: '10px', overflow: 'hidden', backgroundColor: '#000' }}>
        {cameraEnabled ? (
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
            mirrored={true}
            style={{ width: '100%', maxWidth: '640px', height: 'auto' }}
          />
        ) : (
          <div style={{ width: '640px', height: '480px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#fff' }}>
            Camera is Off
          </div>
        )}

        {/* This Canvas is where we will draw MediaPipe landmarks later */}
        <canvas
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
          }}
        />
      </div>

      <div style={{ marginTop: '20px' }}>
        <button 
          onClick={() => setCameraEnabled(!cameraEnabled)}
          style={{ padding: '10px 20px', cursor: 'pointer', borderRadius: '5px' }}
        >
          {cameraEnabled ? "Stop Camera" : "Start Camera"}
        </button>
      </div>

      <div style={{ marginTop: '20px', padding: '15px', background: '#f0f0f0', borderRadius: '8px', width: '100%', maxWidth: '640px' }}>
        <strong>Detected Text:</strong> 
        <span style={{ marginLeft: '10px', fontSize: '1.2rem', color: '#007bff' }}>
           Waiting for hand...
        </span>
      </div>
    </div>
  );
};

export default Home;