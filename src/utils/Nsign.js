import { Finger, FingerCurl, FingerDirection, GestureDescription } from 'fingerpose';

export const nSign = new GestureDescription('N');

// ==========================================
// THUMB: Tucked between index and middle fingers
// ==========================================
// MediaPipe often struggles to see the exact curl of a tucked thumb. 
// We accept both Half Curl and Full Curl.
nSign.addCurl(Finger.Thumb, FingerCurl.HalfCurl, 1.0);
nSign.addCurl(Finger.Thumb, FingerCurl.FullCurl, 0.85);

// Fixed typo: targeting Finger.Thumb. We allow multiple vertical/diagonal 
// directions because the thumb is pressed up against the knuckles.
nSign.addDirection(Finger.Thumb, FingerDirection.VerticalUp, 0.8);
nSign.addDirection(Finger.Thumb, FingerDirection.DiagonalUpLeft, 0.8);
nSign.addDirection(Finger.Thumb, FingerDirection.DiagonalUpRight, 0.8);

// ==========================================
// INDEX, MIDDLE, RING, PINKY: The Closed Fist
// ==========================================
nSign.addCurl(Finger.Index, FingerCurl.FullCurl, 1.0);
nSign.addCurl(Finger.Middle, FingerCurl.FullCurl, 1.0);
nSign.addCurl(Finger.Ring, FingerCurl.FullCurl, 1.0);
nSign.addCurl(Finger.Pinky, FingerCurl.FullCurl, 1.0);

// Keep the stable internal vertical vectors typical of fists.
// We allow slight diagonal variations so tilting your hand doesn't drop the sign.
nSign.addDirection(Finger.Index, FingerDirection.VerticalUp, 0.8);
nSign.addDirection(Finger.Index, FingerDirection.DiagonalUpRight, 0.7);

nSign.addDirection(Finger.Middle, FingerDirection.VerticalUp, 0.8);

nSign.addDirection(Finger.Ring, FingerDirection.VerticalUp, 0.8);

nSign.addDirection(Finger.Pinky, FingerDirection.VerticalUp, 0.8);
nSign.addDirection(Finger.Pinky, FingerDirection.DiagonalUpLeft, 0.7);