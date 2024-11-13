const multGamma = 1.0;
const multBeta = 0.7;
const colorMultiplier = 3;

// Automatically request motion access for iOS without displaying a button
function initializeMotionAccess() {
  if (typeof DeviceMotionEvent.requestPermission === "function") {
    // For iOS 13+ devices, request permission to access motion data
    DeviceMotionEvent.requestPermission()
      .then((response) => {
        if (response === "granted") {
          startGradientEffect();
        } else {
          alert("Permission to access motion data was denied.");
        }
      })
      .catch(console.error);
  } else {
    // Non-iOS devices or browsers that don’t require explicit permission
    startGradientEffect();
  }
}

// Start gradient effect and set up motion detection
function startGradientEffect() {
  const gradientElement = document.querySelector("#gradient1");

  // Start motion handling to dynamically update gradient
  startMotionHandler((gamma, beta) => {
    const angle = ((gamma + 90) / 180) * 360; // Normalize gamma to range from 0 to 360

    // Calculate RGB values based on angle for dynamic color effect
    const red = Math.abs(Math.sin((angle * Math.PI) / 180) * 255);
    const green = Math.abs(Math.cos((angle * Math.PI) / 180) * 255);
    const blue = Math.abs(Math.sin(((angle + 90) * Math.PI) / 180) * 255);

    // Update gradient stop colors based on tilt values
    gradientElement.children[0].setAttribute(
      "style",
      `stop-color: rgba(${red}, 0, 0, 1);`
    );
    gradientElement.children[1].setAttribute(
      "style",
      `stop-color: rgba(255, ${green}, 0, 1);`
    );
    gradientElement.children[2].setAttribute(
      "style",
      `stop-color: rgba(255, 255, ${blue}, 1);`
    );
    gradientElement.children[3].setAttribute(
      "style",
      `stop-color: rgba(0, ${green}, ${blue}, 0.8);`
    );
    gradientElement.children[4].setAttribute(
      "style",
      `stop-color: rgba(0, 0, ${blue}, 1);`
    );
  });
}

// Motion handler to apply real or simulated values depending on device/browser
function startMotionHandler(onMotionUpdate) {
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

      if (xPosition >= 5 || xPosition <= -5) stepX = -stepX;
      if (yPosition >= 5 || yPosition <= -5) stepY = -stepY;

      onMotionUpdate(xPosition, yPosition);
    }, 10);
  } else if (window.DeviceOrientationEvent) {
    // For devices with motion sensors, listen for orientation events
    window.addEventListener("deviceorientation", (event) => {
      const gamma = (event.gamma || 0) * multGamma;
      const beta = (event.beta || 0) * multBeta;

      onMotionUpdate(gamma, beta);
    });
  } else {
    alert("Device orientation not supported on this device/browser.");
  }
}

// Initialize motion access for iOS or start directly on other devices
initializeMotionAccess();

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
  moveText(document.querySelector(".text3"), 255, 105, 10000);
  moveText(document.querySelector(".text4"), 85, 270, 10000);
  moveText(document.querySelector(".text5"), 290, 70, 10000);
});
