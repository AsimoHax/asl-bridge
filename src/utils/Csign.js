import { Finger, FingerCurl, FingerDirection, GestureDescription } from 'fingerpose';

export const cSign = new GestureDescription('C');

// ==========================================
// THUMB: Must be wide open and straight
// ==========================================
cSign.addCurl(Finger.Thumb, FingerCurl.NoCurl, 1.0);

cSign.addDirection(Finger.Thumb, FingerDirection.HorizontalLeft, 0.80);
cSign.addDirection(Finger.Thumb, FingerDirection.HorizontalRight, 0.80);
cSign.addDirection(Finger.Thumb, FingerDirection.DiagonalUpRight, 0.80);
cSign.addDirection(Finger.Thumb, FingerDirection.DiagonalUpLeft, 0.80);

// ==========================================
// THE FOUR FINGERS: Wide open claw shape
// ==========================================
for (const finger of [Finger.Index, Finger.Middle, Finger.Ring, Finger.Pinky]) {
    cSign.addCurl(finger, FingerCurl.NoCurl, 1.0);      // High priority for straight open fingers
    cSign.addCurl(finger, FingerCurl.HalfCurl, 0.7);    // Low priority fallback for slight curves
}

cSign.addDirection(Finger.Index, FingerDirection.HorizontalRight, 0.75);
cSign.addDirection(Finger.Index, FingerDirection.HorizontalLeft, 0.75);
cSign.addDirection(Finger.Index, FingerDirection.DiagonalUpRight, 0.75);
cSign.addDirection(Finger.Index, FingerDirection.DiagonalUpLeft, 0.75);