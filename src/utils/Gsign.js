import { Finger, FingerCurl, FingerDirection, GestureDescription } from 'fingerpose';

export const gSign = new GestureDescription('G');

// ==========================================
// INDEX FINGER: Pointing straight out sideways
// ==========================================
gSign.addCurl(Finger.Index, FingerCurl.NoCurl, 1.0);
gSign.addCurl(Finger.Index, FingerCurl.HalfCurl, 0.8);
// Traditional 'G' points across the body horizontally
gSign.addDirection(Finger.Index, FingerDirection.HorizontalRight, 1.0);
gSign.addDirection(Finger.Index, FingerDirection.HorizontalLeft, 1.0);
gSign.addDirection(Finger.Index, FingerDirection.DiagonalUpRight, 0.75);
gSign.addDirection(Finger.Index, FingerDirection.DiagonalUpLeft, 0.75);

// ==========================================
// THUMB: Straight, parallel to the index finger
// ==========================================
gSign.addCurl(Finger.Thumb, FingerCurl.NoCurl, 1.0);
gSign.addCurl(Finger.Thumb, FingerCurl.HalfCurl, 0.8);

// Tracks along the same horizontal/diagonal plane as the index
gSign.addDirection(Finger.Thumb, FingerDirection.HorizontalRight, 1.0);
gSign.addDirection(Finger.Thumb, FingerDirection.HorizontalLeft, 1.0);
gSign.addDirection(Finger.Thumb, FingerDirection.DiagonalUpRight, 0.75);
gSign.addDirection(Finger.Thumb, FingerDirection.DiagonalUpLeft, 0.75);

// ==========================================
// MIDDLE, RING, PINKY: Tucked tightly into a fist
// ==========================================
gSign.addCurl(Finger.Middle, FingerCurl.FullCurl, 1.0);
gSign.addCurl(Finger.Ring, FingerCurl.FullCurl, 1.0);
gSign.addCurl(Finger.Pinky, FingerCurl.FullCurl, 1.0);

