// Function to update gradient based on device tilt with increased sensitivity
function updateGradient(tiltX, tiltY) {
  const gradientCircle = document.querySelector(".gradient-circle");

  // Increase sensitivity by scaling tilt values
  const angleX = (Math.min(Math.max(tiltX, -90), 90) + 90) * 1.5;
  const angleY = (Math.min(Math.max(tiltY, -90), 90) + 90) * 1.5;
  const angle = (angleX * 0.7 + angleY * 0.3) % 360;

  // Update the gradient angle dynamically
  gradientCircle.style.background = `
      radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0.3) 25%, rgba(255, 255, 255, 0.1) 50%, rgba(255, 255, 255, 0) 75%) 50% 50%,
      radial-gradient(circle at 50% 50%, rgba(240, 230, 140, 0.3) 0%, rgba(250, 250, 210, 0.2) 30%, rgba(240, 230, 140, 0) 70%) 50% 50%,
      linear-gradient(${angle}deg, rgba(255, 154, 158, 0.7), rgba(250, 208, 196, 0.7), rgba(212, 252, 121, 0.7), rgba(150, 230, 161, 0.7), rgba(146, 169, 255, 0.7), rgba(255, 154, 158, 0.7))
    `;
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
