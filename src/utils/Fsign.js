import { Finger, FingerCurl, FingerDirection, GestureDescription } from 'fingerpose';

export const fSign = new GestureDescription('F');

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

fSign.addCurl(Finger.Thumb, FingerCurl.HalfCurl, 0.6);
fSign.addCurl(Finger.Thumb, FingerCurl.FullCurl, 0.6); 

fSign.addCurl(Finger.Index, FingerCurl.HalfCurl, 0.6);
fSign.addCurl(Finger.Index, FingerCurl.FullCurl, 0.6);
