import { Finger, FingerCurl, FingerDirection, GestureDescription } from 'fingerpose';

export const qSign = new GestureDescription('Q');

// ==========================================
// INDEX FINGER: Pointing straight down
// ==========================================
qSign.addCurl(Finger.Index, FingerCurl.NoCurl, 1.0);

// The index finger must point downward for 'Q'
qSign.addDirection(Finger.Index, FingerDirection.VerticalDown, 1.0);
qSign.addDirection(Finger.Index, FingerDirection.DiagonalDownRight, 0.85);
qSign.addDirection(Finger.Index, FingerDirection.DiagonalDownLeft, 0.85);

// ==========================================
// THUMB: Parallel to the index finger, pointing down
// ==========================================
qSign.addCurl(Finger.Thumb, FingerCurl.NoCurl, 1.0);
qSign.addCurl(Finger.Thumb, FingerCurl.HalfCurl, 0.8); // Fallback for a slight natural curve

qSign.addDirection(Finger.Thumb, FingerDirection.VerticalDown, 1.0);
qSign.addDirection(Finger.Thumb, FingerDirection.DiagonalDownRight, 0.85);
qSign.addDirection(Finger.Thumb, FingerDirection.DiagonalDownLeft, 0.85);

// ==========================================
// MIDDLE, RING, PINKY: Tucked tightly into the palm
// ==========================================
qSign.addCurl(Finger.Middle, FingerCurl.FullCurl, 1.0);
qSign.addCurl(Finger.Ring, FingerCurl.FullCurl, 1.0);
qSign.addCurl(Finger.Pinky, FingerCurl.FullCurl, 1.0);