import { Finger, FingerCurl, FingerDirection, GestureDescription } from 'fingerpose';

export const kSign = new GestureDescription('K');

// Active Fingers: Both standing straight up
kSign.addCurl(Finger.Index, FingerCurl.NoCurl, 1.0);
kSign.addDirection(Finger.Index, FingerDirection.VerticalUp, 1.0);

kSign.addCurl(Finger.Middle, FingerCurl.NoCurl, 1.0);
kSign.addDirection(Finger.Middle, FingerDirection.VerticalUp, 1.0);

// Active Thumb: Pointing upright/diagonally outward (NOT CURLED)
kSign.addCurl(Finger.Thumb, FingerCurl.NoCurl, 1.0);
kSign.addDirection(Finger.Thumb, FingerDirection.VerticalUp, 1.0);
kSign.addDirection(Finger.Thumb, FingerDirection.DiagonalUpLeft, 1.0);
kSign.addDirection(Finger.Thumb, FingerDirection.DiagonalUpRight, 1.0);

// Fist Base: Track curls ONLY, no direction trap
kSign.addCurl(Finger.Ring, FingerCurl.FullCurl, 1.0);
kSign.addCurl(Finger.Pinky, FingerCurl.FullCurl, 1.0);