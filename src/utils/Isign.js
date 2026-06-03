import { Finger, FingerCurl, FingerDirection, GestureDescription } from 'fingerpose';

export const iSign = new GestureDescription('I');

// ==========================================
// PINKY FINGER: The only finger that matters
// ==========================================
iSign.addCurl(Finger.Pinky, FingerCurl.NoCurl, 1.0);

// Loosen the pinky's direction so it stays tracked during natural hand movement
iSign.addDirection(Finger.Pinky, FingerDirection.VerticalUp, 1.0);
iSign.addDirection(Finger.Pinky, FingerDirection.DiagonalUpRight, 0.85);
iSign.addDirection(Finger.Pinky, FingerDirection.DiagonalUpLeft, 0.85);

// ==========================================
// THUMB: Crossed over the front of the fist
// ==========================================
// Depending on camera angle, a crossed thumb reads as Half or Full curl.
iSign.addCurl(Finger.Thumb, FingerCurl.HalfCurl, 1.0);
iSign.addCurl(Finger.Thumb, FingerCurl.FullCurl, 0.9);


// ==========================================
// INDEX, MIDDLE, RING: The Fist Base
// ==========================================
iSign.addCurl(Finger.Index, FingerCurl.FullCurl, 1.0);
iSign.addCurl(Finger.Index, FingerCurl.HalfCurl, 0.7); // Fallback for a loose fist

iSign.addCurl(Finger.Middle, FingerCurl.FullCurl, 1.0);
iSign.addCurl(Finger.Middle, FingerCurl.HalfCurl, 0.7);

iSign.addCurl(Finger.Ring, FingerCurl.FullCurl, 1.0);
iSign.addCurl(Finger.Ring, FingerCurl.HalfCurl, 0.7);
