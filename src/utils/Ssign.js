import { Finger, FingerCurl, FingerDirection, GestureDescription } from 'fingerpose';

export const sSign = new GestureDescription('S');

// ==========================================
// THUMB: Crossing diagonally over the front knuckles
// ==========================================
// In 'S', the thumb is on the outside, resting loosely over the fingers.
sSign.addCurl(Finger.Thumb, FingerCurl.HalfCurl, 1.0);
sSign.addCurl(Finger.Thumb, FingerCurl.NoCurl, 0.9);
sSign.addCurl(Finger.Thumb, FingerCurl.FullCurl, 0.2); // Heavily penalize the deep tuck of 'E'!

// If the thumb goes purely horizontal, 'S' will instantly lose points.
sSign.addDirection(Finger.Thumb, FingerDirection.DiagonalUpRight, 1.0);
sSign.addDirection(Finger.Thumb, FingerDirection.DiagonalUpLeft, 1.0);
sSign.addDirection(Finger.Thumb, FingerDirection.VerticalUp, 0.6); // Straight up fallback

// ==========================================
// INDEX, MIDDLE, RING, PINKY: Balled Fist Base
// ==========================================
for (const finger of [Finger.Index, Finger.Middle, Finger.Ring, Finger.Pinky]) {
    sSign.addCurl(finger, FingerCurl.FullCurl, 1.0);
    sSign.addCurl(finger, FingerCurl.HalfCurl, 0.6); // Loose fist fallback

}