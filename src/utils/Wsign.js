import { Finger, FingerCurl, FingerDirection, GestureDescription } from 'fingerpose';

export const wSign = new GestureDescription('W');

// Thumb
wSign.addCurl(Finger.Thumb, FingerCurl.HalfCurl, 1.0);
wSign.addCurl(Finger.Thumb, FingerCurl.NoCurl, 0.8);
wSign.addDirection(Finger.Thumb, FingerDirection.DiagonalUpLeft, 0.70);
wSign.addDirection(Finger.Thumb, FingerDirection.VerticalUp, 0.50);

// Index
wSign.addCurl(Finger.Index, FingerCurl.NoCurl, 1.0);
wSign.addDirection(Finger.Index, FingerDirection.DiagonalUpLeft, 0.70);
wSign.addDirection(Finger.Index, FingerDirection.VerticalUp, 0.50);

// Middle
wSign.addCurl(Finger.Middle, FingerCurl.NoCurl, 1.0);
wSign.addDirection(Finger.Middle, FingerDirection.VerticalUp, 1.0);

// Ring
wSign.addCurl(Finger.Ring, FingerCurl.NoCurl, 1.0);
wSign.addDirection(Finger.Ring, FingerDirection.DiagonalUpRight, 0.70);
wSign.addDirection(Finger.Ring, FingerDirection.VerticalUp, 0.50);

// Pinky
wSign.addCurl(Finger.Pinky, FingerCurl.FullCurl, 1.0);
wSign.addCurl(Finger.Pinky, FingerCurl.HalfCurl, 0.90);