import { Finger, FingerCurl, FingerDirection, GestureDescription } from 'fingerpose';

export const sSign = new GestureDescription('S');

// THUMB: Flat over the front knuckles
sSign.addCurl(Finger.Thumb, FingerCurl.HalfCurl, 1.0);
sSign.addCurl(Finger.Thumb, FingerCurl.NoCurl, 0.8);

// Completely strip VerticalUp! S thumb must cross the hand.
sSign.addDirection(Finger.Thumb, FingerDirection.HorizontalLeft, 1.0);
sSign.addDirection(Finger.Thumb, FingerDirection.HorizontalRight, 1.0);
sSign.addDirection(Finger.Thumb, FingerDirection.DiagonalUpRight, 0.9);
sSign.addDirection(Finger.Thumb, FingerDirection.DiagonalUpLeft, 0.9);

// FIST BASE
for (const finger of [Finger.Index, Finger.Middle, Finger.Ring, Finger.Pinky]) {
    sSign.addCurl(finger, FingerCurl.FullCurl, 1.0);
    sSign.addCurl(finger, FingerCurl.HalfCurl, 0.3); // Kept strict to reject T
}