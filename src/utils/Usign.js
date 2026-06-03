import { Finger, FingerCurl, FingerDirection, GestureDescription } from 'fingerpose';

export const uSign = new GestureDescription('U');

// Active Fingers: Straight up together
uSign.addCurl(Finger.Index, FingerCurl.NoCurl, 1.0);
uSign.addDirection(Finger.Index, FingerDirection.VerticalUp, 1.0);

uSign.addCurl(Finger.Middle, FingerCurl.NoCurl, 1.0);
uSign.addDirection(Finger.Middle, FingerDirection.VerticalUp, 1.0);

// Active Thumb: Flattened sideways across palm
uSign.addCurl(Finger.Thumb, FingerCurl.FullCurl, 1.0);
uSign.addDirection(Finger.Thumb, FingerDirection.HorizontalLeft, 1.0);
uSign.addDirection(Finger.Thumb, FingerDirection.HorizontalRight, 1.0);

// Fist Base: Track curls ONLY, no direction trap
uSign.addCurl(Finger.Ring, FingerCurl.FullCurl, 1.0);
uSign.addCurl(Finger.Pinky, FingerCurl.FullCurl, 1.0);