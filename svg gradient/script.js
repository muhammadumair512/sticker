// Check for iOS-specific permission for motion events
// Directly check and request motion permission for iOS without showing a button
if (window.DeviceOrientationEvent) {
  // Check if explicit permission request is needed (iOS 13+)
  if (typeof DeviceOrientationEvent.requestPermission === "function") {
    // Attempt to request permission immediately without showing a button
    DeviceOrientationEvent.requestPermission()
      .then((response) => {
        if (response === "granted") {
          DeviceMotionEvent.requestPermission()
            .then((motionResponse) => {
              if (motionResponse === "granted") {
                startMotionDetection(); // Start detection if both permissions are granted
              } else {
                alert("Motion permission denied.");
              }
            })
            .catch(console.error);
        } else {
          alert("Orientation permission denied.");
        }
      })
      .catch(console.error);
  } else {
    // For devices that don't require explicit permission, start detection directly
    startMotionDetection();
  }
} else {
  alert("Device orientation events are not supported on this device.");
}

// Function to start motion detection and update gradient
function startMotionDetection() {
  const isMacSafari =
    /^((?!chrome|android).)*safari/i.test(navigator.userAgent) &&
    navigator.platform.toUpperCase().indexOf("MAC") >= 0;

  if (isMacSafari) {
    // Simulate oscillation effect for Mac Safari without motion sensors
    let xPosition = 0;
    let yPosition = 0;
    let stepX = 0.1;
    let stepY = 0.1;

    setInterval(() => {
      xPosition += stepX;
      yPosition += stepY;

      // Reverse direction at boundaries
      if (xPosition >= 5 || xPosition <= -5) stepX = -stepX;
      if (yPosition >= 5 || yPosition <= -5) stepY = -stepY;

      updateGradient(xPosition, yPosition);
    }, 100);
  } else {
    // Use actual motion data on devices with sensors
    window.addEventListener("deviceorientation", (event) => {
      const gamma = event.gamma || 0;
      const beta = event.beta || 0;

      // Only update if within bounds
      if (gamma >= -90 && gamma <= 90 && beta >= -180 && beta <= 180) {
        updateGradient(gamma, beta);
      }
    });
  }
}

// Function to calculate and update the gradient dynamically
function updateGradient(gamma, beta) {
  const angle = ((gamma + 90) / 180) * 360; // Normalize gamma to range from 0 to 360

  // Calculate RGB values based on angle for a dynamic color effect
  const red = Math.abs(Math.sin((angle * Math.PI) / 180) * 255);
  const green = Math.abs(Math.cos((angle * Math.PI) / 180) * 255);
  const blue = Math.abs(Math.sin(((angle + 90) * Math.PI) / 180) * 255);

  // Update gradient stop colors based on tilt values
  const gradient = document.querySelector("#gradient1");
  gradient.children[0].setAttribute(
    "style",
    `stop-color: rgba(${red}, 0, 0, 1);`
  );
  gradient.children[1].setAttribute(
    "style",
    `stop-color: rgba(255, ${green}, 0, 1);`
  );
  gradient.children[2].setAttribute(
    "style",
    `stop-color: rgba(255, 255, ${blue}, 1);`
  );
  gradient.children[3].setAttribute(
    "style",
    `stop-color: rgba(0, ${green}, ${blue}, 0.8);`
  );
  gradient.children[4].setAttribute(
    "style",
    `stop-color: rgba(0, 0, ${blue}, 1);`
  );
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
