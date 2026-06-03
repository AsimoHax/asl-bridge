import { Finger, FingerCurl, FingerDirection, GestureDescription } from 'fingerpose';

export const lSign = new GestureDescription('L');

// ==========================================
// THUMB: Completely open, sticking straight out (90 degrees)
// ==========================================
lSign.addCurl(Finger.Thumb, FingerCurl.NoCurl, 1.0);

// Crucial Change: The thumb must point sideways, not up!
lSign.addDirection(Finger.Thumb, FingerDirection.HorizontalRight, 1.0);
lSign.addDirection(Finger.Thumb, FingerDirection.HorizontalLeft, 1.0);
lSign.addDirection(Finger.Thumb, FingerDirection.DiagonalUpRight, 0.6);
lSign.addDirection(Finger.Thumb, FingerDirection.DiagonalUpLeft, 0.6);

// ==========================================
// INDEX FINGER: Sticking straight up
// ==========================================
lSign.addCurl(Finger.Index, FingerCurl.NoCurl, 1.0);
lSign.addDirection(Finger.Index, FingerDirection.VerticalUp, 1.0);
lSign.addDirection(Finger.Index, FingerDirection.DiagonalUpRight, 0.7);
lSign.addDirection(Finger.Index, FingerDirection.DiagonalUpLeft, 0.7);

// ==========================================
// MIDDLE, RING, PINKY: Tightly balled into the palm
// ==========================================
lSign.addCurl(Finger.Middle, FingerCurl.FullCurl, 1.0);
lSign.addCurl(Finger.Ring, FingerCurl.FullCurl, 1.0);
lSign.addCurl(Finger.Pinky, FingerCurl.FullCurl, 1.0);

// Keeping the stable fist vectors
lSign.addDirection(Finger.Middle, FingerDirection.VerticalUp, 0.75);
lSign.addDirection(Finger.Ring, FingerDirection.VerticalUp, 0.75);
lSign.addDirection(Finger.Pinky, FingerDirection.VerticalUp, 0.75);