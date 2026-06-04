import { Finger, FingerCurl, FingerDirection, GestureDescription } from 'fingerpose';

export const aSign = new GestureDescription('A');

// THUMB: Up and outward along the side
aSign.addCurl(Finger.Thumb, FingerCurl.NoCurl, 1.0);
// aSign.addCurl(Finger.Thumb, FingerCurl.HalfCurl, 1.0); 

// Target the outer profile
aSign.addDirection(Finger.Thumb, FingerDirection.VerticalUp, 1.0);
// aSign.addDirection(Finger.Thumb, FingerDirection.DiagonalUpLeft, 0.85); // For right hand outer edge
// aSign.addDirection(Finger.Thumb, FingerDirection.DiagonalUpRight, 0.85); // For left hand outer edge

// FIST BASE
for (const finger of [Finger.Index, Finger.Middle, Finger.Ring, Finger.Pinky]) {
    aSign.addCurl(finger, FingerCurl.FullCurl, 1.0);
    // aSign.addCurl(finger, FingerCurl.HalfCurl, 0.7); 
}