import { Finger, FingerCurl, FingerDirection, GestureDescription } from 'fingerpose';

export const tSign = new GestureDescription('T');

// ==========================================
// THUMB: Tucked tightly over the index knuckle
// ==========================================
// In a real 'T', the thumb bends over the knuckle, making HalfCurl the truest match.
tSign.addCurl(Finger.Thumb, FingerCurl.HalfCurl, 1.0); 
tSign.addCurl(Finger.Thumb, FingerCurl.NoCurl, 0.75); // Lowered fallback weight

// We lower the direction weights so a slight diagonal slant doesn't get a perfect score.
tSign.addDirection(Finger.Thumb, FingerDirection.DiagonalUpRight, 0.85);
tSign.addDirection(Finger.Thumb, FingerDirection.DiagonalUpLeft, 0.85);
tSign.addDirection(Finger.Thumb, FingerDirection.VerticalUp, 0.60); // Low priority safety net

// ==========================================
// INDEX, MIDDLE, RING, PINKY: Curled Fist
// ==========================================
for (const finger of [Finger.Index, Finger.Middle, Finger.Ring, Finger.Pinky]) {
    tSign.addCurl(finger, FingerCurl.FullCurl, 1.0);
    tSign.addCurl(finger, FingerCurl.HalfCurl, 0.6);
}