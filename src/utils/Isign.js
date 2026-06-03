import { Finger, FingerCurl, FingerDirection, GestureDescription } from 'fingerpose';

export const iSign = new GestureDescription('I');

// ==========================================
// PINKY FINGER: The Star of the Show (Must be straight)
// ==========================================
iSign.addCurl(Finger.Pinky, FingerCurl.NoCurl, 1.0);

// Allow the pinky to tilt naturally so the gesture doesn't break
iSign.addDirection(Finger.Pinky, FingerDirection.VerticalUp, 1.0);
iSign.addDirection(Finger.Pinky, FingerDirection.DiagonalUpRight, 0.8);
iSign.addDirection(Finger.Pinky, FingerDirection.DiagonalUpLeft, 0.8);

// ==========================================
// THUMB: Crossed over the front of the fist
// ==========================================
// Depending on hand size, crossing the thumb can read as Half Curl or Full Curl
iSign.addCurl(Finger.Thumb, FingerCurl.HalfCurl, 0.9);
iSign.addCurl(Finger.Thumb, FingerCurl.FullCurl, 0.8);

// Give it relaxed directional options so it doesn't fight the math
iSign.addDirection(Finger.Thumb, FingerDirection.VerticalUp, 0.7);
iSign.addDirection(Finger.Thumb, FingerDirection.DiagonalUpLeft, 0.7);
iSign.addDirection(Finger.Thumb, FingerDirection.DiagonalUpRight, 0.7);

// ==========================================
// INDEX, MIDDLE, RING: Tightly curled fist base
// ==========================================
iSign.addCurl(Finger.Index, FingerCurl.FullCurl, 1.0);
iSign.addCurl(Finger.Middle, FingerCurl.FullCurl, 1.0);
iSign.addCurl(Finger.Ring, FingerCurl.FullCurl, 1.0);

// Keep the stable fist vertical vectors
iSign.addDirection(Finger.Index, FingerDirection.VerticalUp, 0.75);
iSign.addDirection(Finger.Middle, FingerDirection.VerticalUp, 0.75);
iSign.addDirection(Finger.Ring, FingerDirection.VerticalUp, 0.75);