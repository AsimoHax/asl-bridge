import React, { useRef, useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import { FilesetResolver, HandLandmarker, DrawingUtils } from '@mediapipe/tasks-vision';
import * as fp from "fingerpose";
import ASLAlphabet from "../utils/index";
import '../styles/LearnSigns.css';

// Sign image imports (a-z)
import aImg from '../image/asign.jpg';
import bImg from '../image/bsign.jpg';
import cImg from '../image/csign.jpg';
import dImg from '../image/dsign.jpg';
import eImg from '../image/esign.jpg';
import fImg from '../image/fsign.jpg';
import gImg from '../image/gsign.jpg';
import hImg from '../image/hsign.jpg';
import iImg from '../image/isign.jpg';
import jImg from '../image/jsign.jpg';
import kImg from '../image/ksign.jpg';
import lImg from '../image/lsign.jpg';
import mImg from '../image/msign.jpg';
import nImg from '../image/nsign.jpg';
import oImg from '../image/osign.jpg';
import pImg from '../image/psign.jpg';
import qImg from '../image/qsign.jpg';
import rImg from '../image/rsign.jpg';
import sImg from '../image/ssign.jpg';
import tImg from '../image/tsign.jpg';
import uImg from '../image/usign.jpg';
import vImg from '../image/vsign.jpg';
import wImg from '../image/wsign.jpg';
import xImg from '../image/xsign.jpg';
import yImg from '../image/ysign.jpg';
import zImg from '../image/zsign.jpg';

const SIGN_IMAGES = {
  A: aImg, B: bImg, C: cImg, D: dImg, E: eImg, F: fImg, G: gImg,
  H: hImg, I: iImg, J: jImg, K: kImg, L: lImg, M: mImg, N: nImg,
  O: oImg, P: pImg, Q: qImg, R: rImg, S: sImg, T: tImg, U: uImg,
  V: vImg, W: wImg, X: xImg, Y: yImg, Z: zImg,
};

const LANGUAGE_OPTIONS = [
  { value: 'en', label: 'English' },
  { value: 'fr', label: 'French' },
  { value: 'es', label: 'Spanish' },
  { value: 'de', label: 'German' },
  { value: 'it', label: 'Italian' },
  { value: 'pt', label: 'Portuguese' },
  { value: 'ru', label: 'Russian' },
  { value: 'zh', label: 'Chinese' },
  { value: 'ja', label: 'Japanese' },
  { value: 'ko', label: 'Korean' },
  { value: 'hi', label: 'Hindi' },
  { value: 'ar', label: 'Arabic' },
  { value: 'tr', label: 'Turkish' },
  { value: 'nl', label: 'Dutch' },
  { value: 'pl', label: 'Polish' },
  { value: 'vi', label: 'Vietnamese' },
  { value: 'sv', label: 'Swedish' },
  { value: 'fi', label: 'Finnish' },
];

const TRANSLATION_ENDPOINTS = [
  'https://libretranslate.de/translate',
  'https://translate.argosopentech.com/translate',
];

const latinizeText = (text) => {
  return text
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/ß/g, 'ss')
    .replace(/Æ/g, 'AE')
    .replace(/æ/g, 'ae')
    .replace(/Œ/g, 'OE')
    .replace(/œ/g, 'oe')
    .replace(/[^A-Za-z ]/g, '');
};

const cleanWordForASL = (text) => {
  return latinizeText(text).toUpperCase();
};

const translateText = async (text, sourceLang) => {
  const trimmed = text.trim();
  if (!trimmed) return null;

  const googleUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${encodeURIComponent(sourceLang)}&tl=en&dt=t&q=${encodeURIComponent(trimmed)}`;
  try {
    const response = await fetch(googleUrl);
    if (response.ok) {
      const data = await response.json();
      if (Array.isArray(data) && Array.isArray(data[0]) && typeof data[0][0][0] === 'string') {
        return data[0].map((item) => item[0]).join('');
      }
    }
  } catch (err) {
    console.warn('Google translate fetch failed:', err);
  }

  for (const endpoint of TRANSLATION_ENDPOINTS) {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ q: trimmed, source: sourceLang, target: 'en', format: 'text' }),
      });
      if (!response.ok) continue;
      const data = await response.json();
      if (typeof data.translatedText === 'string' && data.translatedText.trim()) {
        return data.translatedText;
      }
      if (typeof data.translation === 'string' && data.translation.trim()) {
        return data.translation;
      }
    } catch (err) {
      console.warn('Fallback translate fetch failed:', err);
      continue;
    }
  }
  return null;
};

const GE = new fp.GestureEstimator(ASLAlphabet);

const LearnSigns = () => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const handLandmarkerRef = useRef(null);

  const [prediction, setPrediction] = useState('');
  const [cameraOn, setCameraOn] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [sourcePhrase, setSourcePhrase] = useState('HELLO');
  const [targetWord, setTargetWord] = useState('HELLO');
  const [selectedLetter, setSelectedLetter] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [completedIndices, setCompletedIndices] = useState([]);
  const [showReference, setShowReference] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testStatus, setTestStatus] = useState('Awaiting...');
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationError, setTranslationError] = useState(false);

  const gestureHistoryRef = useRef([]);
  const pinkyPathRef = useRef([]);
  const indexPathRef = useRef([]);
  const stableCountRef = useRef(0);
  const bestScoreRef = useRef(0);
  const animFrameRef = useRef(null);

  const BUFFER_SIZE = 30;

  // --- Hand Landmarker Setup ---
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
    if (historyArray.length === 0) return { mostFrequent: null, counts: {} };
    const counts = {};
    let maxCount = 0;
    let mostFrequent = null;
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
    const s = pathArray[0], e = pathArray[pathArray.length - 1];
    return (e.y - s.y > 0.05 && Math.abs(e.x - s.x) > 0.05);
  };

  const isDrawingZCurve = (pathArray) => {
    if (pathArray.length < 15) return false;
    let changes = 0, lastSign = 0;
    for (let i = 1; i < pathArray.length; i++) {
      let dx = pathArray[i].x - pathArray[i - 1].x;
      if (Math.abs(dx) > 0.005) {
        let sign = Math.sign(dx);
        if (lastSign !== 0 && sign !== lastSign) changes++;
        lastSign = sign;
      }
    }
    return changes >= 2;
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
        const lm = results.landmarks[0];
        const transformed = lm.map(l => [l.x, l.y, l.z]);

        pinkyPathRef.current.push({ x: lm[20].x, y: lm[20].y });
        indexPathRef.current.push({ x: lm[8].x, y: lm[8].y });
        if (pinkyPathRef.current.length > BUFFER_SIZE) pinkyPathRef.current.shift();
        if (indexPathRef.current.length > BUFFER_SIZE) indexPathRef.current.shift();

        if (transformed.length === 21) {
          const gesture = GE.estimate(transformed, 7.0);
          if (gesture.gestures && gesture.gestures.length > 0) {
            const scores = gesture.gestures.map(p => p.score);
            const maxIdx = scores.indexOf(Math.max(...scores));
            fingerposeGesture = gesture.gestures[maxIdx].name;
            bestScoreRef.current = gesture.gestures[maxIdx].score;
          }
        }
      }

      if (handDetected) {
        gestureHistoryRef.current.push(fingerposeGesture);
        if (gestureHistoryRef.current.length > BUFFER_SIZE) gestureHistoryRef.current.shift();

        let { mostFrequent } = getMostFrequentGesture(gestureHistoryRef.current);

        if (mostFrequent === 'J' || mostFrequent === 'I') {
          mostFrequent = isDrawingJCurve(pinkyPathRef.current) ? "J" : "I";
        }
        if (mostFrequent === 'Z' || mostFrequent === 'D') {
          mostFrequent = isDrawingZCurve(indexPathRef.current) ? "Z" : "D";
        }

        setPrediction(mostFrequent || '');
      } else {
        if (gestureHistoryRef.current.length > 0) gestureHistoryRef.current.shift();
        pinkyPathRef.current = [];
        indexPathRef.current = [];
        stableCountRef.current = 0;
        bestScoreRef.current = 0;
        setPrediction('');
      }

      // Draw landmarks
      if (canvasRef.current) {
        const ctx = canvasRef.current.getContext("2d");
        const drawUtils = new DrawingUtils(ctx);
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        ctx.save();
        ctx.translate(canvasRef.current.width, 0);
        ctx.scale(-1, 1);
        if (results.landmarks && results.landmarks.length > 0) {
          for (const landmarks of results.landmarks) {
            drawUtils.drawConnectors(landmarks, HandLandmarker.HAND_CONNECTIONS, {
              color: "#00FF00", lineWidth: 5
            });
            drawUtils.drawLandmarks(landmarks, { color: "#FF0000", lineWidth: 2 });
          }
        }
        ctx.restore();
      }
    }
    animFrameRef.current = requestAnimationFrame(renderLoop);
  };

  // --- Camera Controls ---
  const handleStartCamera = () => {
    setCameraOn(true);
    createHandLandmarker();
  };

  const handleStopCamera = () => {
    setCameraOn(false);
    setIsTesting(false);
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    setPrediction('');
  };

  // --- Word Controls ---
  const getFirstValidLetter = (word) => {
    return word.split('').find((char) => char !== ' ') || '';
  };

  const getFirstValidLetterIndex = (word) => {
    const index = word.split('').findIndex((char) => char !== ' ');
    return index === -1 ? null : index;
  };

  const handleLanguageChange = (event) => {
    setSelectedLanguage(event.target.value);
  };

  const handleSourceChange = (event) => {
    setSourcePhrase(event.target.value);
  };

  const handleLetterClick = (letter, index) => {
    if (letter === ' ') return;
    setSelectedLetter(letter);
    setSelectedIndex(index);
    setShowReference(false);
    setIsTesting(false);
    setTestStatus('Awaiting...');
  };

  const handleTestLetter = () => {
    if (!selectedLetter) return;
    if (!cameraOn) {
      handleStartCamera();
    }
    setIsTesting(true);
    setTestStatus('Awaiting...');
  };

  const toggleReference = () => {
    setShowReference((prev) => !prev);
  };

  useEffect(() => {
    let active = true;
    const normalizeText = sourcePhrase.trim();

    const updateTranslation = async () => {
      if (normalizeText === '') {
        setTargetWord('');
        setTranslationError(false);
        return;
      }

      if (selectedLanguage === 'en') {
        setTargetWord(cleanWordForASL(normalizeText));
        setTranslationError(false);
        return;
      }

      setIsTranslating(true);
      setTranslationError(false);
      const translated = await translateText(normalizeText, selectedLanguage);
      if (!active) return;
      if (translated) {
        setTargetWord(cleanWordForASL(translated));
        setTranslationError(false);
      } else {
        setTargetWord('');
        setTranslationError(true);
      }
      setIsTranslating(false);
    };

    updateTranslation();
    return () => { active = false; };
  }, [selectedLanguage, sourcePhrase]);

  useEffect(() => {
    setCompletedIndices([]);
    setSelectedLetter(getFirstValidLetter(targetWord));
    setSelectedIndex(getFirstValidLetterIndex(targetWord));
    setShowReference(false);
    setIsTesting(false);
    setTestStatus('Awaiting...');
  }, [targetWord]);

  useEffect(() => {
    if (!isTesting || selectedIndex === null || !selectedLetter || !prediction) return;
    if (prediction === selectedLetter) {
      setTestStatus('Correct');
      setCompletedIndices((prev) => prev.includes(selectedIndex) ? prev : [...prev, selectedIndex]);
    } else {
      setTestStatus('Awaiting...');
    }
  }, [prediction, isTesting, selectedLetter, selectedIndex]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  const wordLetters = targetWord.split('');
  const visibleLetters = wordLetters.filter((char) => char !== ' ');
  const totalLetters = visibleLetters.length;
  const isWordComplete = completedIndices.length === totalLetters;

  return (
    <div className="learn-page">
      <div className="learn-grid">
        {/* ── Left Column: Camera Feed ── */}
        <div className="learn-camera-col">
          <div className="card learn-camera-card">
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

            {/* Video Viewport */}
            <div className="learn-viewport">
              {cameraOn ? (
                <>
                  <Webcam
                    ref={webcamRef}
                    mirrored={true}
                    className="learn-video"
                  />
                  <canvas
                    ref={canvasRef}
                    width="640"
                    height="480"
                    className="learn-canvas"
                  />
                  {/* Prediction Overlay */}
                  <div className="learn-prediction-overlay">
                    <span className="learn-prediction-letter">
                      {prediction || '—'}
                    </span>
                  </div>
                </>
              ) : (
                <div className="learn-camera-off">
                  <div className="learn-camera-off-icon">
                    <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="23 7 16 12 23 17 23 7" />
                      <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                    </svg>
                  </div>
                  <p className="learn-camera-off-title">Camera is off</p>
                  <p className="learn-camera-off-sub">Click "Start Camera" to begin practicing</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Right Column: Learning Sidebar ── */}
        <div className="learn-sidebar-col">
          {/* Card 1: Language Input */}
          <div className="card learn-word-card">
            <div className="learn-language-controls">
              <label className="learn-language-field">
                <span>Language</span>
                <select value={selectedLanguage} onChange={handleLanguageChange}>
                  {LANGUAGE_OPTIONS.map((lang) => (
                    <option key={lang.value} value={lang.value}>{lang.label}</option>
                  ))}
                </select>
              </label>
              <label className="learn-language-field">
                <span>Phrase</span>
                <input
                  type="text"
                  value={sourcePhrase}
                  onChange={handleSourceChange}
                  placeholder="Bonjour, Hola, Hallo..."
                />
              </label>
            </div>
            <div className="learn-word-translation">
              <p className="learn-word-label">English translation</p>
              <h2 className="learn-word-value">
                {isTranslating ? 'Translating…' : (targetWord || '...')}
              </h2>
              {translationError && (
                <p className="learn-translation-error">Translation failed. Please try another phrase or language.</p>
              )}
            </div>
            <div className="learn-progress-track">
              <div
                className="learn-progress-fill"
                style={{ width: `${(completedIndices.length / Math.max(totalLetters, 1)) * 100}%` }}
              />
            </div>
            <p className="learn-progress-text">
              {isWordComplete
                ? '🎉 Word complete!'
                : `${completedIndices.length} / ${totalLetters} letters`
              }
            </p>
          </div>

          {/* Card 2: Interactive Word Speller */}
          <div className="card learn-speller-card">
            <div className="learn-speller-header">
              <p className="learn-speller-label">Spell it out</p>
              <button className="btn btn-test" onClick={handleTestLetter}>
                {cameraOn ? 'Test Letter' : 'Start Test'}
              </button>
            </div>
          <div className="learn-speller-letters">
            {(() => {
              let visibleIndex = 0;
              return wordLetters.map((letter, idx) => {
                if (letter === ' ') {
                  return <div key={idx} className="speller-gap" />;
                }
                
                // 1. Capture the exact index for this specific valid letter
                const currentIndex = visibleIndex;
                
                // 2. Safely increment the counter for the next loop iteration
                visibleIndex += 1;

                // 3. Evaluate your states using the stable currentIndex
                const isCompleted = completedIndices.includes(currentIndex);
                const isActive = letter === selectedLetter && currentIndex === selectedIndex && !isCompleted;
                const isNext = currentIndex === completedIndices.length;

                return (
                  <button
                    key={idx}
                    className={`speller-letter ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''} ${isNext ? 'next' : ''}`}
                    onClick={() => handleLetterClick(letter, currentIndex)} // <-- Passing the correct index now!
                  >
                    {letter}
                  </button>
                );
              });
            })()}
          </div>
            <p className={`learn-test-status ${testStatus === 'Correct' ? 'correct' : ''}`}>
              {testStatus}
            </p>
            <p className="learn-speller-hint">Select a letter, then press Test Letter to compare your gesture.</p>
          </div>

          {/* Card 3: Reference Sign Image */}
          <div className="card learn-reference-card">
            <div className="learn-reference-header">
              <p className="learn-reference-label">Reference Sign</p>
              <div className="learn-reference-header-actions">
                {selectedLetter && (
                  <span className="learn-reference-badge">{selectedLetter}</span>
                )}
                {selectedLetter && (
                  <button className="btn btn-toggle-ref" onClick={toggleReference}>
                    {showReference ? 'Hide' : 'Show'}
                  </button>
                )}
              </div>
            </div>
            <div className="learn-reference-image-box">
              {selectedLetter && showReference && SIGN_IMAGES[selectedLetter] ? (
                <img
                  src={SIGN_IMAGES[selectedLetter]}
                  alt={`ASL sign for ${selectedLetter}`}
                  className="learn-reference-img"
                />
              ) : (
                <div className="learn-reference-empty">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#CBD5E1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                  <p>
                    {selectedLetter
                      ? 'Reference is hidden. Open it to view the sign.'
                      : 'Select a letter above to enable the reference.'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearnSigns;
