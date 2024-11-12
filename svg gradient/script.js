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

    // Create dynamic color changes based on angle for the gradient stops
    const red = Math.abs(Math.sin((angle * Math.PI) / 180) * 255); // Sine function to create dynamic color effect
    const green = Math.abs(Math.cos((angle * Math.PI) / 180) * 255); // Cosine function for green
    const blue = Math.abs(Math.sin(((angle + 90) * Math.PI) / 180) * 255); // Another sine for blue

    // Update gradient stop colors based on tilt
    gradient.children[0].setAttribute(
      "style",
      `stop-color: rgba(${red}, 0, 0, 1);`
    ); // Red stop
    gradient.children[1].setAttribute(
      "style",
      `stop-color: rgba(${255 - red}, ${green}, 0, 1);`
    ); // Orange-Yellow stop
    gradient.children[2].setAttribute(
      "style",
      `stop-color: rgba(255, ${green}, 0, 1);`
    ); // Yellow stop
    gradient.children[3].setAttribute(
      "style",
      `stop-color: rgba(0, ${green}, ${blue}, 1);`
    ); // Green stop
    gradient.children[4].setAttribute(
      "style",
      `stop-color: rgba(0, 0, ${blue}, 1);`
    ); // Blue stop
  });
}
