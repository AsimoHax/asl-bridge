import { Finger, FingerCurl, FingerDirection, GestureDescription } from 'fingerpose';

export const sSign = new GestureDescription('S');

// THUMB: Bắt buộc vắt ngang, loại bỏ hoàn toàn NoCurl và DiagonalUp
sSign.addCurl(Finger.Thumb, FingerCurl.HalfCurl, 1.0);
sSign.addDirection(Finger.Thumb, FingerDirection.HorizontalLeft, 1.0);
sSign.addDirection(Finger.Thumb, FingerDirection.HorizontalRight, 1.0);

// Helper function (như đã dùng ở chữ M) để khóa dáng nắm đấm
const addDownwardDirections = (sign, finger) => {
    sign.addDirection(finger, FingerDirection.VerticalDown, 1.0);
    sign.addDirection(finger, FingerDirection.DiagonalDownLeft, 0.5);
    sign.addDirection(finger, FingerDirection.DiagonalDownRight, 0.5);
};

// FIST BASE: Khóa chặt FullCurl và ép hướng gập xuống lòng bàn tay
const fistFingers = [Finger.Index, Finger.Middle, Finger.Ring, Finger.Pinky];
for (const finger of fistFingers) {
    sSign.addCurl(finger, FingerCurl.FullCurl, 1.0);
    sSign.addCurl(finger, FingerCurl.HalfCurl, 0.3); // Giữ mức thấp để không nhầm với T
    addDownwardDirections(sSign, finger);
}