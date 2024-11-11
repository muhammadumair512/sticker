// Function to update gradient based on device tilt
function updateGradient(tiltX, tiltY) {
  const gradientCircle = document.querySelector(".gradient-circle");

  // Map the tilt values to angle degrees
  const angleX = Math.min(Math.max(tiltX, -90), 90) + 90;
  const angleY = Math.min(Math.max(tiltY, -90), 90) + 90;
  const angle = angleX * 0.5 + angleY * 0.5; // Adjust the weight if needed

  // Update the gradient angle
  gradientCircle.style.background = `linear-gradient(${angle}deg, #FF00FF, #00FFFF, #FFAA00, #AAFF00)`;
}

// Detect if on mobile to enable device orientation
if (window.DeviceOrientationEvent) {
  window.addEventListener("deviceorientation", (event) => {
    const { beta, gamma } = event; // tilt front/back and left/right
    if (beta !== null && gamma !== null) {
      updateGradient(gamma, beta);
    }
  });
}
