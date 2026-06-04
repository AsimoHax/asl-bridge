import { Finger, FingerCurl, GestureDescription } from 'fingerpose';

export const eSign = new GestureDescription('E');

// Thumb
eSign.addCurl(Finger.Thumb, FingerCurl.FullCurl, 1.0);
eSign.addCurl(Finger.Thumb, FingerCurl.HalfCurl, 0.9);

// Index, Middle, Ring, Pinky
for (const finger of [Finger.Index, Finger.Middle, Finger.Ring, Finger.Pinky]) {
    eSign.addCurl(finger, FingerCurl.FullCurl, 1.0);
    eSign.addCurl(finger, FingerCurl.HalfCurl, 0.8);
}