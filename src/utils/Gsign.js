import { Finger, FingerCurl, FingerDirection, GestureDescription } from 'fingerpose';

export const gSign = new GestureDescription('G');

// INDEX FINGER
gSign.addCurl(Finger.Index, FingerCurl.NoCurl, 1.0);
gSign.addCurl(Finger.Index, FingerCurl.HalfCurl, 0.7); // Lowered slightly
gSign.addDirection(Finger.Index, FingerDirection.HorizontalRight, 1.0);
gSign.addDirection(Finger.Index, FingerDirection.HorizontalLeft, 1.0);
gSign.addDirection(Finger.Index, FingerDirection.DiagonalUpRight, 0.75);
gSign.addDirection(Finger.Index, FingerDirection.DiagonalUpLeft, 0.75);

// THUMB
gSign.addCurl(Finger.Thumb, FingerCurl.NoCurl, 1.0);
gSign.addCurl(Finger.Thumb, FingerCurl.HalfCurl, 0.7); // Lowered slightly
gSign.addDirection(Finger.Thumb, FingerDirection.HorizontalRight, 1.0);
gSign.addDirection(Finger.Thumb, FingerDirection.HorizontalLeft, 1.0);

// MIDDLE, RING, PINKY: Tucked tight. 
for (const finger of [Finger.Middle, Finger.Ring, Finger.Pinky]) {
    gSign.addCurl(finger, FingerCurl.FullCurl, 1.0);
    gSign.addCurl(finger, FingerCurl.HalfCurl, 0.6); // Strict fallback
    
    // Fists facing sideways naturally track their curled tips pointing backwards/downwards
    gSign.addDirection(finger, FingerDirection.VerticalUp, 0.7);
    gSign.addDirection(finger, FingerDirection.DiagonalUpRight, 0.7);
    gSign.addDirection(finger, FingerDirection.DiagonalUpLeft, 0.7);
}