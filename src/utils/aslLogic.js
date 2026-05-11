// A simple function to calculate if a finger is "up" or "down"
export const detectASL = (landmarks) => {
  if (!landmarks) return null;

  // Landmark indices: 8=Index Tip, 12=Middle Tip, 16=Ring Tip, 20=Pinky Tip
  // 5, 9, 13, 17 are the base knuckles
  const isIndexUp = landmarks[8].y < landmarks[6].y;
  const isMiddleUp = landmarks[12].y < landmarks[10].y;
  const isRingUp = landmarks[16].y < landmarks[14].y;
  const isPinkyUp = landmarks[20].y < landmarks[18].y;

  // Simple Logic for "Number 4" (Index, Middle, Ring, Pinky all up)
  if (isIndexUp && isMiddleUp && isRingUp && isPinkyUp && landmarks[4].y > landmarks[8].y) {
    return "4";
  }

  // Simple Logic for "Peace Sign / Number 2"
  if (isIndexUp && isMiddleUp && !isRingUp && !isPinkyUp) {
    return "V / 2";
  }

  return "Detecting...";
};