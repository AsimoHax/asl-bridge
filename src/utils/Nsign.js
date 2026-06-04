import { Finger, FingerCurl, FingerDirection, GestureDescription } from 'fingerpose';

export const nSign = new GestureDescription('N');

// Thumb
nSign.addCurl(Finger.Thumb, FingerCurl.HalfCurl, 1.0);
nSign.addCurl(Finger.Thumb, FingerCurl.FullCurl, 0.9);
nSign.addDirection(Finger.Thumb, FingerDirection.HorizontalLeft, 0.9);
nSign.addDirection(Finger.Thumb, FingerDirection.HorizontalRight, 0.9);

// Index
nSign.addCurl(Finger.Index, FingerCurl.FullCurl, 1.0);
nSign.addCurl(Finger.Index, FingerCurl.HalfCurl, 0.85);

// Middle
nSign.addCurl(Finger.Middle, FingerCurl.FullCurl, 1.0);
nSign.addCurl(Finger.Middle, FingerCurl.HalfCurl, 0.85);
nSign.addDirection(Finger.Middle, FingerDirection.VerticalUp, 0.8);
nSign.addDirection(Finger.Middle, FingerDirection.DiagonalUpRight, 0.7);
nSign.addDirection(Finger.Middle, FingerDirection.DiagonalUpLeft, 0.7);

// Ring
nSign.addCurl(Finger.Ring, FingerCurl.FullCurl, 1.0);
nSign.addCurl(Finger.Ring, FingerCurl.HalfCurl, 0.5);
nSign.addDirection(Finger.Ring, FingerDirection.VerticalUp, 0.8);
nSign.addDirection(Finger.Ring, FingerDirection.DiagonalUpLeft, 0.65);
nSign.addDirection(Finger.Ring, FingerDirection.DiagonalUpRight, 0.65);

// Pinky
nSign.addCurl(Finger.Pinky, FingerCurl.FullCurl, 1.0);
nSign.addCurl(Finger.Pinky, FingerCurl.HalfCurl, 0.5);
nSign.addDirection(Finger.Pinky, FingerDirection.VerticalUp, 0.8);
nSign.addDirection(Finger.Pinky, FingerDirection.DiagonalUpLeft, 0.65);
nSign.addDirection(Finger.Pinky, FingerDirection.DiagonalUpRight, 0.65);