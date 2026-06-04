import { Finger, FingerCurl, FingerDirection, GestureDescription } from 'fingerpose';

export const eSign = new GestureDescription('E');

// THUMB: Tucked horizontally flat underneath the fingernails
eSign.addCurl(Finger.Thumb, FingerCurl.FullCurl, 1.0);
eSign.addDirection(Finger.Thumb, FingerDirection.HorizontalLeft, 1.0);
eSign.addDirection(Finger.Thumb, FingerDirection.HorizontalRight, 1.0);

// FIST BASE: Track curls only
for (const finger of [Finger.Index, Finger.Middle, Finger.Ring, Finger.Pinky]) {
    eSign.addCurl(finger, FingerCurl.FullCurl, 1.0);
    eSign.addCurl(finger, FingerCurl.HalfCurl, 0.95); 
}