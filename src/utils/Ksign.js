import { Finger, FingerCurl, FingerDirection, GestureDescription } from 'fingerpose';

export const kSign = new GestureDescription('K');

// ==========================================
// INDEX & MIDDLE FINGERS: Standing Up (The "V" Shape)
// ==========================================
kSign.addCurl(Finger.Index, FingerCurl.NoCurl, 1.0);
kSign.addCurl(Finger.Middle, FingerCurl.NoCurl, 1.0);

// Allow them to flare slightly left or right naturally
kSign.addDirection(Finger.Index, FingerDirection.VerticalUp, 1.0);
kSign.addDirection(Finger.Index, FingerDirection.DiagonalUpLeft, 0.8);
kSign.addDirection(Finger.Index, FingerDirection.DiagonalUpRight, 0.8);

kSign.addDirection(Finger.Middle, FingerDirection.VerticalUp, 1.0);
kSign.addDirection(Finger.Middle, FingerDirection.DiagonalUpLeft, 0.8);
kSign.addDirection(Finger.Middle, FingerDirection.DiagonalUpRight, 0.8);

// ==========================================
// THUMB: Pressed against the index finger joint
// ==========================================
// This is the chaotic zone. We must accept both NoCurl and HalfCurl 
// with relaxed directions to accommodate MediaPipe's depth tracking limits.
kSign.addCurl(Finger.Thumb, FingerCurl.NoCurl, 0.9);
kSign.addCurl(Finger.Thumb, FingerCurl.HalfCurl, 0.9);

kSign.addDirection(Finger.Thumb, FingerDirection.VerticalUp, 0.8);
kSign.addDirection(Finger.Thumb, FingerDirection.DiagonalUpLeft, 0.8);
kSign.addDirection(Finger.Thumb, FingerDirection.DiagonalUpRight, 0.8);

// ==========================================
// RING & PINKY FINGERS: Curled into the palm
// ==========================================
kSign.addCurl(Finger.Ring, FingerCurl.FullCurl, 1.0);
kSign.addCurl(Finger.Pinky, FingerCurl.FullCurl, 1.0);

// Standard fist vectors
kSign.addDirection(Finger.Ring, FingerDirection.VerticalUp, 0.75);
kSign.addDirection(Finger.Pinky, FingerDirection.VerticalUp, 0.75);