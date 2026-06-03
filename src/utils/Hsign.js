import { Finger, FingerCurl, FingerDirection, GestureDescription } from 'fingerpose';

export const hSign = new GestureDescription('H');

// ==========================================
// INDEX & MIDDLE FINGERS: Sticking out horizontally
// ==========================================
hSign.addCurl(Finger.Index, FingerCurl.NoCurl, 1.0);
hSign.addCurl(Finger.Middle, FingerCurl.NoCurl, 1.0);

// Allow both left and right hand directions, plus slight natural tilts
hSign.addDirection(Finger.Index, FingerDirection.HorizontalRight, 1.0);
hSign.addDirection(Finger.Index, FingerDirection.HorizontalLeft, 1.0);
hSign.addDirection(Finger.Index, FingerDirection.DiagonalUpRight, 0.8);
hSign.addDirection(Finger.Index, FingerDirection.DiagonalUpLeft, 0.8);

hSign.addDirection(Finger.Middle, FingerDirection.HorizontalRight, 1.0);
hSign.addDirection(Finger.Middle, FingerDirection.HorizontalLeft, 1.0);
hSign.addDirection(Finger.Middle, FingerDirection.DiagonalUpRight, 0.8);
hSign.addDirection(Finger.Middle, FingerDirection.DiagonalUpLeft, 0.8);

// ==========================================
// THUMB, RING, PINKY: Tucked / Hidden (The Blind Spot)
// ==========================================
// Because these are hidden on the palm side, we accept multiple curl states
// and lower the confidence drastically so bad tracking doesn't break the match.
hSign.addCurl(Finger.Thumb, FingerCurl.FullCurl, 0.6);
hSign.addCurl(Finger.Thumb, FingerCurl.HalfCurl, 0.6);
hSign.addCurl(Finger.Thumb, FingerCurl.NoCurl, 0.6);

hSign.addCurl(Finger.Ring, FingerCurl.FullCurl, 0.65);
hSign.addCurl(Finger.Ring, FingerCurl.HalfCurl, 0.65);

hSign.addCurl(Finger.Pinky, FingerCurl.FullCurl, 0.65);
hSign.addCurl(Finger.Pinky, FingerCurl.HalfCurl, 0.65);

// CRUCIAL: No direction constraints for Thumb, Ring, or Pinky.
// Forcing a direction on hidden fingers makes 'H' nearly impossible to trigger.