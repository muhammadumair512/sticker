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
    gradient.children[0].setAttribute("style", `stop-color: red;`); // Red stop
    gradient.children[1].setAttribute("style", `stop-color: green;`); // Orange-Yellow stop
    gradient.children[2].setAttribute("style", `stop-color: blue;`); // Yellow stop
    gradient.children[3].setAttribute(
      "style",
      `stop-color: rgba(0, ${green}, ${blue}, 0.8);`
    ); // Green stop
    gradient.children[4].setAttribute(
      "style",
      `stop-color: rgba(0, 0, ${blue}, 1);`
    ); // Blue stop
  });
}
// script for diagonal text move

function calculatePosition(degree, radius) {
  const radians = (degree - 60) * (Math.PI / 180);
  return {
    x: radius * Math.cos(radians),
    y: radius * Math.sin(radians),
  };
}

function moveText(element, startDegree, endDegree, duration) {
  const radius = 300; // Radius of the circle-container
  const startPos = calculatePosition(startDegree, radius);
  const endPos = calculatePosition(endDegree, radius);
  const keyframes = [
    {
      transform: `translate(${startPos.x}px, ${startPos.y}px) rotate(30deg)`,
    },
    {
      transform: `translate(${endPos.x}px, ${endPos.y}px) rotate(30deg)`,
    },
  ];
  element.animate(keyframes, {
    duration: duration,
    iterations: Infinity,
    easing: "linear",
  });
}

document.addEventListener("DOMContentLoaded", () => {
  moveText(document.querySelector(".text1"), 215, 145, 10000);
  moveText(document.querySelector(".text2"), 125, 235, 10000);
  moveText(document.querySelector(".text3"), 245, 100, 10000);
  moveText(document.querySelector(".text4"), 80, 260, 10000);
  moveText(document.querySelector(".text5"), 280, 60, 10000);
});
// gradient circle

// Function to update gradient based on device tilt with increased sensitivity
function updateGradient(tiltX, tiltY) {
  const gradientCircle = document.querySelector(".gradient-circle");

  // Adjust sensitivity by scaling tilt values
  const angleX = (Math.min(Math.max(tiltX, -90), 90) + 90) * 1.5;
  const angleY = (Math.min(Math.max(tiltY, -90), 90) + 90) * 1.5;
  const angle = (angleX * 0.7 + angleY * 0.3) % 360;

  gradientCircle.style.background = `
radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0.3) 25%, rgba(255, 255, 255, 0.1) 50%, rgba(255, 255, 255, 0) 75%) 50% 50%,
radial-gradient(circle at 50% 50%, rgba(240, 230, 140, 0.3) 0%, rgba(250, 250, 210, 0.2) 30%, rgba(240, 230, 140, 0) 70%) 50% 50%,
linear-gradient(${angle}deg, rgba(255, 154, 158, 0.7), rgba(250, 208, 196, 0.7), rgba(212, 252, 121, 0.7), rgba(150, 230, 161, 0.7), rgba(146, 169, 255, 0.7), rgba(255, 154, 158, 0.7))
`;
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

// circle script
const text = document.querySelector(".text p");
text.innerHTML = text.innerText
  .split("")
  .map(
    (char, i) => `<span style="transform:rotate(${i * 15}deg)">${char}</span>`
  )
  .join("");
