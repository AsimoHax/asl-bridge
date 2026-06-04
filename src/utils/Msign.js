import { Finger, FingerCurl, FingerDirection, GestureDescription } from 'fingerpose';

export const mSign = new GestureDescription('M');

// Thumb
mSign.addCurl(Finger.Thumb, FingerCurl.FullCurl, 1.0);
mSign.addCurl(Finger.Thumb, FingerCurl.HalfCurl, 0.85);
mSign.addDirection(Finger.Thumb, FingerDirection.HorizontalLeft, 0.9);
mSign.addDirection(Finger.Thumb, FingerDirection.HorizontalRight, 0.9);
mSign.addDirection(Finger.Thumb, FingerDirection.DiagonalUpLeft, 0.7);
mSign.addDirection(Finger.Thumb, FingerDirection.DiagonalUpRight, 0.7);

// Index
mSign.addCurl(Finger.Index, FingerCurl.FullCurl, 1.0);
mSign.addCurl(Finger.Index, FingerCurl.HalfCurl, 0.85);
mSign.addDirection(Finger.Index, FingerDirection.VerticalUp, 0.8);
mSign.addDirection(Finger.Index, FingerDirection.DiagonalUpRight, 0.7);
mSign.addDirection(Finger.Index, FingerDirection.DiagonalUpLeft, 0.7);

// Middle
mSign.addCurl(Finger.Middle, FingerCurl.FullCurl, 1.0);
mSign.addCurl(Finger.Middle, FingerCurl.HalfCurl, 0.85);
mSign.addDirection(Finger.Middle, FingerDirection.VerticalUp, 0.8);
mSign.addDirection(Finger.Middle, FingerDirection.DiagonalUpRight, 0.7);
mSign.addDirection(Finger.Middle, FingerDirection.DiagonalUpLeft, 0.7);

// Ring
mSign.addCurl(Finger.Ring, FingerCurl.FullCurl, 1.0);
mSign.addCurl(Finger.Ring, FingerCurl.HalfCurl, 0.85);
mSign.addDirection(Finger.Ring, FingerDirection.VerticalUp, 0.8);
mSign.addDirection(Finger.Ring, FingerDirection.DiagonalUpRight, 0.7);
mSign.addDirection(Finger.Ring, FingerDirection.DiagonalUpLeft, 0.7);

// Pinky
mSign.addCurl(Finger.Pinky, FingerCurl.FullCurl, 1.0);
mSign.addCurl(Finger.Pinky, FingerCurl.HalfCurl, 0.6);
mSign.addDirection(Finger.Pinky, FingerDirection.VerticalUp, 0.8);
mSign.addDirection(Finger.Pinky, FingerDirection.DiagonalUpLeft, 0.7);
mSign.addDirection(Finger.Pinky, FingerDirection.DiagonalUpRight, 0.7);