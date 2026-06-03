import { Finger, FingerCurl, FingerDirection, GestureDescription } from 'fingerpose';

export const hSign = new GestureDescription('H');

// INDEX & MIDDLE: Must point horizontally across the screen together
for (const finger of [Finger.Index, Finger.Middle]) {
    hSign.addCurl(finger, FingerCurl.NoCurl, 1.0);
    hSign.addCurl(finger, FingerCurl.HalfCurl, 0.7); // Fallback for camera blur
    
    hSign.addDirection(finger, FingerDirection.HorizontalRight, 1.0);
    hSign.addDirection(finger, FingerDirection.HorizontalLeft, 1.0);
    hSign.addDirection(finger, FingerDirection.DiagonalUpRight, 0.8);
    hSign.addDirection(finger, FingerDirection.DiagonalUpLeft, 0.8);
}

// THUMB, RING, PINKY: Hidden / Tucked away
for (const finger of [Finger.Thumb, Finger.Ring, Finger.Pinky]) {
    hSign.addCurl(finger, FingerCurl.FullCurl, 1.0);
    hSign.addCurl(finger, FingerCurl.HalfCurl, 0.8);
    hSign.addCurl(finger, FingerCurl.NoCurl, 0.5); // Loose thumb support
}
