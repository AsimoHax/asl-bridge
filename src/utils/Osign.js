import { Finger, FingerCurl, FingerDirection, GestureDescription } from 'fingerpose';

export const oSign = new GestureDescription('O');

// ==========================================
// THUMB: Curved inward to lock the circle
// ==========================================
// In a true 'O', the thumb bends at the knuckle. Forcing NoCurl makes it a 'C'.
oSign.addCurl(Finger.Thumb, FingerCurl.HalfCurl, 1.0);
oSign.addCurl(Finger.Thumb, FingerCurl.NoCurl, 0.7); // Fallback for flat hands
oSign.addDirection(Finger.Thumb, FingerDirection.DiagonalUpRight, 0.8);
oSign.addDirection(Finger.Thumb, FingerDirection.DiagonalUpLeft, 0.8);
oSign.addDirection(Finger.Thumb, FingerDirection.VerticalUp, 0.8);

// ==========================================
// THE FOUR FINGERS: Creating a uniform curve
// ==========================================
// Every finger must be curved to meet the thumb. MediaPipe will jump between 
// Half and Full curl depending on your hand angle, so we accept both.
for (const finger of [Finger.Index, Finger.Middle, Finger.Ring, Finger.Pinky]) {
    oSign.addCurl(finger, FingerCurl.HalfCurl, 1.0);
    oSign.addCurl(finger, FingerCurl.FullCurl, 0.85);
    
    // Give them wide directional tolerances so tilting the hand doesn't break the 'O'
    oSign.addDirection(finger, FingerDirection.DiagonalUpRight, 0.8);
    oSign.addDirection(finger, FingerDirection.DiagonalUpLeft, 0.8);
    oSign.addDirection(finger, FingerDirection.VerticalUp, 0.8);
}