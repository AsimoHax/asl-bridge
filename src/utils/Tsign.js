import { Finger, FingerCurl, FingerDirection, GestureDescription } from 'fingerpose';

export const tSign = new GestureDescription('T');

// THUMB: Wedged deeply inside the fist
tSign.addCurl(Finger.Thumb, FingerCurl.FullCurl, 1.0);
tSign.addCurl(Finger.Thumb, FingerCurl.HalfCurl, 0.9);

// Points strictly sideways/downwards inside the pocket
tSign.addDirection(Finger.Thumb, FingerDirection.HorizontalLeft, 1.0);
tSign.addDirection(Finger.Thumb, FingerDirection.HorizontalRight, 1.0);

// INDEX FINGER: Relaxed curl due to the thumb wedge
tSign.addCurl(Finger.Index, FingerCurl.HalfCurl, 1.0);
tSign.addCurl(Finger.Index, FingerCurl.FullCurl, 1.0);

// MIDDLE, RING, PINKY FINGERS
for (const finger of [Finger.Middle, Finger.Ring, Finger.Pinky]) {
    tSign.addCurl(finger, FingerCurl.FullCurl, 1.0);
    tSign.addCurl(finger, FingerCurl.HalfCurl, 0.5);
}