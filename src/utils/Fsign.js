import { Finger, FingerCurl, FingerDirection, GestureDescription } from 'fingerpose';

export const fSign = new GestureDescription('F');

// ==========================================
// THE THREE ANCHORS (Middle, Ring, Pinky)
// ==========================================
// These three fingers are fully visible to the camera, so we make them 
// our ultra-strict anchors. They MUST be straight.
fSign.addCurl(Finger.Middle, FingerCurl.NoCurl, 1.0);
fSign.addCurl(Finger.Ring, FingerCurl.NoCurl, 1.0);
fSign.addCurl(Finger.Pinky, FingerCurl.NoCurl, 1.0);

// Allow them to tilt naturally as the hand faces the camera
fSign.addDirection(Finger.Middle, FingerDirection.VerticalUp, 0.9);
fSign.addDirection(Finger.Middle, FingerDirection.DiagonalUpRight, 0.8);
fSign.addDirection(Finger.Middle, FingerDirection.DiagonalUpLeft, 0.8);

fSign.addDirection(Finger.Ring, FingerDirection.VerticalUp, 0.9);
fSign.addDirection(Finger.Ring, FingerDirection.DiagonalUpRight, 0.8);
fSign.addDirection(Finger.Ring, FingerDirection.DiagonalUpLeft, 0.8);

fSign.addDirection(Finger.Pinky, FingerDirection.VerticalUp, 0.9);
fSign.addDirection(Finger.Pinky, FingerDirection.DiagonalUpRight, 0.8);
fSign.addDirection(Finger.Pinky, FingerDirection.DiagonalUpLeft, 0.8);

// ==========================================
// THE OVERLAPPED PAIR (Thumb & Index)
// ==========================================
// Because they overlap when facing front, MediaPipe's curl readings 
// will be chaotic. We lower the confidence scores drastically.
fSign.addCurl(Finger.Thumb, FingerCurl.HalfCurl, 0.6);
fSign.addCurl(Finger.Thumb, FingerCurl.FullCurl, 0.6); 

fSign.addCurl(Finger.Index, FingerCurl.HalfCurl, 0.6);
fSign.addCurl(Finger.Index, FingerCurl.FullCurl, 0.6);

// CRUCIAL: Drop direction requirements for Thumb and Index completely!
// When facing front, their vector directions flip randomly. Leaving them out
// prevents Fingerpose from rejecting the gesture due to bad direction math.