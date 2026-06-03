import { Finger, FingerCurl, FingerDirection, GestureDescription } from 'fingerpose';

export const pSign = new GestureDescription('P');

// ==========================================
// INDEX FINGER: Pointing horizontally forward
// ==========================================
pSign.addCurl(Finger.Index, FingerCurl.NoCurl, 1.0);

pSign.addDirection(Finger.Index, FingerDirection.HorizontalRight, 1.0);
pSign.addDirection(Finger.Index, FingerDirection.HorizontalLeft, 1.0);
pSign.addDirection(Finger.Index, FingerDirection.DiagonalDownRight, 0.8);
pSign.addDirection(Finger.Index, FingerDirection.DiagonalDownLeft, 0.8);

// ==========================================
// MIDDLE FINGER: Dropping straight down
// ==========================================
// Because it points down, MediaPipe can read it as NoCurl or HalfCurl
pSign.addCurl(Finger.Middle, FingerCurl.NoCurl, 1.0);
pSign.addCurl(Finger.Middle, FingerCurl.HalfCurl, 0.9);

// The middle finger MUST point down to differentiate 'P' from 'K'
pSign.addDirection(Finger.Middle, FingerDirection.VerticalDown, 1.0);
pSign.addDirection(Finger.Middle, FingerDirection.DiagonalDownRight, 0.85);
pSign.addDirection(Finger.Middle, FingerDirection.DiagonalDownLeft, 0.85);

// ==========================================
// THUMB: Reaching across to the index finger
// ==========================================
pSign.addCurl(Finger.Thumb, FingerCurl.NoCurl, 1.0);
pSign.addCurl(Finger.Thumb, FingerCurl.HalfCurl, 0.8);

pSign.addDirection(Finger.Thumb, FingerDirection.HorizontalRight, 1.0);
pSign.addDirection(Finger.Thumb, FingerDirection.HorizontalLeft, 1.0);
pSign.addDirection(Finger.Thumb, FingerDirection.DiagonalDownRight, 0.8);
pSign.addDirection(Finger.Thumb, FingerDirection.DiagonalDownLeft, 0.8);

// ==========================================
// RING & PINKY FINGERS: Curled tightly out of the way
// ==========================================
pSign.addCurl(Finger.Ring, FingerCurl.FullCurl, 1.0);
pSign.addCurl(Finger.Pinky, FingerCurl.FullCurl, 1.0);
