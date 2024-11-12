// Function to update gradient based on device tilt with increased sensitivity
function updateGradient(tiltX, tiltY) {
  const gradientPath = document.querySelector("#myPath");

  // Adjust sensitivity by scaling tilt values
  const angleX = (Math.min(Math.max(tiltX, -90), 90) + 90) * 1.5;
  const angleY = (Math.min(Math.max(tiltY, -90), 90) + 90) * 1.5;
  const angle = (angleX * 0.7 + angleY * 0.3) % 360;

  // Apply the updated gradient based on tilt angle
  const gradient = `linear-gradient(${angle}deg, rgba(255, 154, 158, 0.7), rgba(250, 208, 196, 0.7), rgba(212, 252, 121, 0.7), rgba(150, 230, 161, 0.7), rgba(146, 169, 255, 0.7))`;
  gradientPath.setAttribute("fill", gradient);
}

// Request permission for motion and orientation on iOS
function requestPermissionForiOS() {
  if (typeof DeviceOrientationEvent.requestPermission === "function") {
    DeviceOrientationEvent.requestPermission()
      .then((permissionState) => {
        if (permissionState === "granted") {
          window.addEventListener("deviceorientation", handleOrientation);
          document.getElementById("request-permission").style.display = "none";
        } else {
          alert("Permission to access motion data was denied.");
        }
      })
      .catch(console.error);
  } else {
    // If not iOS, add the event listener directly
    window.addEventListener("deviceorientation", handleOrientation);
  }
}

function handleOrientation(event) {
  const { beta, gamma } = event; // tilt front/back and left/right
  if (beta !== null && gamma !== null) {
    updateGradient(gamma, beta);
  }
}

// Check for iOS and show the permission request button if needed
if (typeof DeviceOrientationEvent.requestPermission === "function") {
  document.getElementById("request-permission").style.display = "block";
  document
    .getElementById("request-permission")
    .addEventListener("click", requestPermissionForiOS);
} else {
  // Directly add the event listener on non-iOS devices
  window.addEventListener("deviceorientation", handleOrientation);
}
