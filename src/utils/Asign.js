import { Finger, FingerCurl, FingerDirection, GestureDescription } from 'fingerpose';

export const aSign = new GestureDescription('A');

aSign.addCurl(Finger.Thumb, FingerCurl.NoCurl, 1.0);
aSign.addCurl(Finger.Thumb, FingerCurl.HalfCurl, 0.6); // Drastically lowered fallback

// Reward the thumb for staying vertical on the outside edge
aSign.addDirection(Finger.Thumb, FingerDirection.VerticalUp, 1.0);
aSign.addDirection(Finger.Thumb, FingerDirection.DiagonalUpRight, 0.85);
aSign.addDirection(Finger.Thumb, FingerDirection.DiagonalUpLeft, 0.85);

// ==========================================
// INDEX, MIDDLE, RING, PINKY: Curled Fist
// ==========================================
for (const finger of [Finger.Index, Finger.Middle, Finger.Ring, Finger.Pinky]) {
    aSign.addCurl(finger, FingerCurl.FullCurl, 1.0);
    aSign.addCurl(finger, FingerCurl.HalfCurl, 0.6);
}