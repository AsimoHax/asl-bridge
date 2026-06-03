import { Finger, FingerCurl, FingerDirection, GestureDescription } from 'fingerpose';

export const dSign = new GestureDescription('D');

// ==========================================
// INDEX FINGER: The "Pointer" (Must be perfectly straight)
// ==========================================
dSign.addCurl(Finger.Index, FingerCurl.NoCurl, 1.0);
// Allow slight natural hand tilts so it doesn't drop detection
dSign.addDirection(Finger.Index, FingerDirection.VerticalUp, 1.0);
dSign.addDirection(Finger.Index, FingerDirection.DiagonalUpRight, 0.8);
dSign.addDirection(Finger.Index, FingerDirection.DiagonalUpLeft, 0.8);

// ==========================================
// THUMB: Tucked inward touching the middle finger
// ==========================================
// MediaPipe can read this as Half or Full curl depending on hand size. We accept both.
dSign.addCurl(Finger.Thumb, FingerCurl.HalfCurl, 0.9);
dSign.addCurl(Finger.Thumb, FingerCurl.FullCurl, 0.8);

// Loosen thumb direction so it doesn't conflict with "L"
dSign.addDirection(Finger.Thumb, FingerDirection.VerticalUp, 0.7);
dSign.addDirection(Finger.Thumb, FingerDirection.DiagonalUpRight, 0.7);
dSign.addDirection(Finger.Thumb, FingerDirection.DiagonalUpLeft, 0.7);

// ==========================================
// MIDDLE, RING, PINKY: The Fist Base
// ==========================================
dSign.addCurl(Finger.Middle, FingerCurl.HalfCurl, 0.9);
dSign.addCurl(Finger.Ring, FingerCurl.FullCurl, 1.0);
dSign.addCurl(Finger.Pinky, FingerCurl.FullCurl, 1.0);

// We keep VerticalUp here because, like the "A" sign, 
// a tight fist vector reliably triggers this internal direction.
//dSign.addDirection(Finger.Middle, FingerDirection.VerticalUp, 0.75);
dSign.addDirection(Finger.Ring, FingerDirection.VerticalUp, 0.75);
dSign.addDirection(Finger.Pinky, FingerDirection.VerticalUp, 0.75);