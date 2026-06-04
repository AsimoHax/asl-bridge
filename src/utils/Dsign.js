import { Finger, FingerCurl, FingerDirection, GestureDescription } from 'fingerpose';

export const dSign = new GestureDescription('D');

// INDEX: Standing straight up
dSign.addCurl(Finger.Index, FingerCurl.NoCurl, 1.0);
dSign.addDirection(Finger.Index, FingerDirection.VerticalUp, 1.0);
dSign.addDirection(Finger.Index, FingerDirection.DiagonalUpRight, 0.8);
dSign.addDirection(Finger.Index, FingerDirection.DiagonalUpLeft, 0.8);

// THUMB: Curled inward touching the middle finger
dSign.addCurl(Finger.Thumb, FingerCurl.HalfCurl, 1.0);
dSign.addCurl(Finger.Thumb, FingerCurl.FullCurl, 0.8);

// FIST BASE: No direction rules allowed here!
for (const finger of [Finger.Middle, Finger.Ring, Finger.Pinky]) {
    dSign.addCurl(finger, FingerCurl.FullCurl, 1.0);
    dSign.addCurl(finger, FingerCurl.HalfCurl, 0.9);
}