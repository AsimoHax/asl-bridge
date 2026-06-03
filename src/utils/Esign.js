import { Finger, FingerCurl, FingerDirection, GestureDescription } from 'fingerpose';

export const eSign = new GestureDescription('E');

eSign.addCurl(Finger.Thumb, FingerCurl.FullCurl, 1.0);
eSign.addCurl(Finger.Thumb, FingerCurl.HalfCurl, 0.6); // Low weight fallback

eSign.addDirection(Finger.Thumb, FingerDirection.HorizontalLeft, 1.0);
eSign.addDirection(Finger.Thumb, FingerDirection.HorizontalRight, 1.0);
eSign.addDirection(Finger.Thumb, FingerDirection.DiagonalUpLeft, 0.5);
eSign.addDirection(Finger.Thumb, FingerDirection.DiagonalUpRight, 0.5);

for (const finger of [Finger.Index, Finger.Middle, Finger.Ring, Finger.Pinky]) {
    eSign.addCurl(finger, FingerCurl.FullCurl, 1.0);
    eSign.addCurl(finger, FingerCurl.HalfCurl, 0.95); 

}