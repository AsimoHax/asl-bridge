import { Finger, FingerCurl, FingerDirection, GestureDescription } from 'fingerpose';

export const vSign = new GestureDescription('V');

// Active Fingers: Flared outwards apart
vSign.addCurl(Finger.Index, FingerCurl.NoCurl, 1.0);
vSign.addDirection(Finger.Index, FingerDirection.DiagonalUpLeft, 1.0);

vSign.addCurl(Finger.Middle, FingerCurl.NoCurl, 1.0);
vSign.addDirection(Finger.Middle, FingerDirection.DiagonalUpRight, 1.0);

// Active Thumb: Flattened sideways across palm
vSign.addCurl(Finger.Thumb, FingerCurl.FullCurl, 1.0);
vSign.addDirection(Finger.Thumb, FingerDirection.HorizontalLeft, 1.0);
vSign.addDirection(Finger.Thumb, FingerDirection.HorizontalRight, 1.0);

// Fist Base: Track curls ONLY, no direction trap
vSign.addCurl(Finger.Ring, FingerCurl.FullCurl, 1.0);
vSign.addCurl(Finger.Pinky, FingerCurl.FullCurl, 1.0);