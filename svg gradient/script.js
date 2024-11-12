// Check for iOS-specific permission for motion events
if (window.DeviceOrientationEvent) {
  const requestPermissionButton = document.getElementById("request-permission");

  // iOS 13+ requires permission to access motion events
  if (typeof DeviceOrientationEvent.requestPermission === "function") {
    requestPermissionButton.style.display = "block";
    requestPermissionButton.addEventListener("click", () => {
      DeviceOrientationEvent.requestPermission()
        .then((response) => {
          if (response === "granted") {
            startMotionDetection();
            requestPermissionButton.style.display = "none"; // Hide button after permission is granted
          } else {
            alert("Permission denied");
          }
        })
        .catch(console.error);
    });
  } else {
    // For other devices, start motion detection directly
    startMotionDetection();
  }
} else {
  alert("Device orientation events are not supported on this device");
}

// Function to handle motion detection and update gradient direction
function startMotionDetection() {
  // Listen for device orientation events
  window.addEventListener("deviceorientation", function (event) {
    const gamma = event.gamma; // Left-to-right tilt (between -90 and 90)
    const beta = event.beta; // Front-to-back tilt (between -180 and 180)

    // If the tilt values are out of bounds, skip the update
    if (gamma < -90 || gamma > 90 || beta < -180 || beta > 180) return;

    // Calculate the gradient angle based on gamma and beta
    const angle = ((gamma + 90) / 180) * 360; // Normalize gamma to range from 0 to 360

    // Update the gradient direction dynamically on the path element
    const gradient = document.querySelector("#gradient1");
    gradient.setAttribute("x1", `${angle}%`);
    gradient.setAttribute("y1", `${100 - angle}%`);
    gradient.setAttribute("x2", `${100 - angle}%`);
    gradient.setAttribute("y2", `${angle}%`);
  });
}
