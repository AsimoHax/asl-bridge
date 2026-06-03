import { Finger, FingerCurl, FingerDirection, GestureDescription } from 'fingerpose';

export const rSign = new GestureDescription('R');

// Active Fingers: Crossed over leaning against each other
rSign.addCurl(Finger.Index, FingerCurl.NoCurl, 1.0);
rSign.addDirection(Finger.Index, FingerDirection.DiagonalUpRight, 1.0);

rSign.addCurl(Finger.Middle, FingerCurl.NoCurl, 1.0);
rSign.addDirection(Finger.Middle, FingerDirection.DiagonalUpLeft, 1.0);

// Active Thumb: Flattened sideways across palm
rSign.addCurl(Finger.Thumb, FingerCurl.FullCurl, 1.0);
rSign.addDirection(Finger.Thumb, FingerDirection.HorizontalLeft, 1.0);
rSign.addDirection(Finger.Thumb, FingerDirection.HorizontalRight, 1.0);

// Fist Base: Track curls ONLY, no direction trap
rSign.addCurl(Finger.Ring, FingerCurl.FullCurl, 1.0);
rSign.addCurl(Finger.Pinky, FingerCurl.FullCurl, 1.0);