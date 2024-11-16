const gradientElement = document.querySelector("#gradient1");

const red = 228;
const green = 235;
const blue = 229;

gradientElement.children[0].setAttribute(
  "style",
  `stop-color: rgba(${red}, 14, 14, 0.9);`
);
gradientElement.children[1].setAttribute(
  "style",
  `stop-color: rgba(9, ${green}, 156, 0.9);`
);
gradientElement.children[2].setAttribute(
  "style",
  `stop-color: rgba(32, 18, ${blue}, 0.9);`
);
gradientElement.children[3].setAttribute(
  "style",
  `stop-color: rgba(192, 168, 168, 0.9);`
);
gradientElement.children[4].setAttribute(
  "style",
  `stop-color: rgba(6, 54, 5, 0.9);`
);

const multGamma = 1.0;
const multBeta = 0.7;
const colorMultiplier = 3;

function initializeMotionAccess() {
  requestPermissionForiOS();
  const circle = document.querySelector(".overlay");
  circle.style.display = "none";
  if (typeof DeviceMotionEvent.requestPermission === "function") {
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
    startGradientEffect();
  }
}

function startMotionHandler(onMotionUpdate) {
  const isMacSafari =
    /^((?!chrome|android).)*safari/i.test(navigator.userAgent) &&
    navigator.platform.toUpperCase().indexOf("MAC") >= 0;

  if (isMacSafari) {
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
    window.addEventListener("deviceorientation", (event) => {
      let gamma = event.gamma || 0;
      let beta = event.beta || 0;
      onMotionUpdate(gamma, beta);
    });
  } else {
    alert("Device orientation not supported on this device/browser.");
  }
}

function startGradientEffect() {
  const gradientElement = document.querySelector("#gradient1");

  // Start the motion handler
  startMotionHandler((x, y) => {
    // Normalize and scale tilt values for noticeable changes
    const normalizedX = x / 25; // Moderate sensitivity
    const normalizedY = y / 25;

    const angle = Math.atan2(normalizedY, normalizedX) * (180 / Math.PI);

    // Apply drop shadow adjustments
    const svgElement = document.querySelector("#svglogo");
    const shadowOffsetX = Math.round(Math.cos((angle * Math.PI) / 180) * 15); // Increased scale
    const shadowOffsetY = Math.round(Math.sin((angle * Math.PI) / 180) * 15);
    svgElement.style.filter = `drop-shadow(${shadowOffsetX}px ${shadowOffsetY}px 10px rgba(0, 0, 0, 0.5))`;

    // Amplify offset shifts for smooth blending
    const offset1 = Math.max(0, 10 + normalizedX * 10); // Offset for stop 1
    const offset2 = Math.max(0, 30 + normalizedY * 10); // Offset for stop 2
    const offset3 = Math.max(0, 50 + normalizedX * 10); // Offset for stop 3
    const offset4 = Math.max(0, 70 + normalizedY * 10); // Offset for stop 4
    const offset5 = 90; // Final stop stays at 100%

    // Adjust colors for better blending
    const color1 = {
      r: Math.max(0, Math.min(255, 228 + normalizedX * 30 - normalizedY * 20)),
      g: Math.max(0, Math.min(255, 14 + normalizedY * 40 - normalizedX * 20)),
      b: Math.max(0, Math.min(255, 14 + normalizedX * 20 + normalizedY * 10)),
    };

    const color2 = {
      r: Math.max(0, Math.min(255, 9 + normalizedY * 30 + normalizedX * 20)),
      g: Math.max(0, Math.min(255, 235 - normalizedX * 30 + normalizedY * 40)),
      b: Math.max(0, Math.min(255, 156 + normalizedX * 20 - normalizedY * 30)),
    };

    const color3 = {
      r: Math.max(0, Math.min(255, 32 - normalizedY * 20 + normalizedX * 40)),
      g: Math.max(0, Math.min(255, 18 + normalizedX * 30 - normalizedY * 20)),
      b: Math.max(0, Math.min(255, 229 + normalizedY * 30 + normalizedX * 10)),
    };

    const color4 = {
      r: Math.max(0, Math.min(255, 192 + normalizedX * 20 + normalizedY * 20)),
      g: Math.max(0, Math.min(255, 168 - normalizedY * 30 + normalizedX * 30)),
      b: Math.max(0, Math.min(255, 168 + normalizedX * 30 - normalizedY * 10)),
    };

    const color5 = {
      r: Math.max(0, Math.min(255, 6 + normalizedY * 40 - normalizedX * 20)),
      g: Math.max(0, Math.min(255, 54 + normalizedX * 20 + normalizedY * 30)),
      b: Math.max(0, Math.min(255, 5 + normalizedY * 20 + normalizedX * 40)),
    };

    // Update gradient stops with smooth blending
    gradientElement.children[0].setAttribute(
      "style",
      `stop-color: rgba(${color1.r}, ${color1.g}, ${color1.b}, 0.9); stop-opacity: 1;`
    );
    gradientElement.children[0].setAttribute("offset", `${offset1}%`);

    gradientElement.children[1].setAttribute(
      "style",
      `stop-color: rgba(${color2.r}, ${color2.g}, ${color2.b}, 0.9); stop-opacity: 1;`
    );
    gradientElement.children[1].setAttribute("offset", `${offset2}%`);

    gradientElement.children[2].setAttribute(
      "style",
      `stop-color: rgba(${color3.r}, ${color3.g}, ${color3.b}, 0.9); stop-opacity: 1;`
    );
    gradientElement.children[2].setAttribute("offset", `${offset3}%`);

    gradientElement.children[3].setAttribute(
      "style",
      `stop-color: rgba(${color4.r}, ${color4.g}, ${color4.b}, 0.9); stop-opacity: 1;`
    );
    gradientElement.children[3].setAttribute("offset", `${offset4}%`);

    gradientElement.children[4].setAttribute(
      "style",
      `stop-color: rgba(${color5.r}, ${color5.g}, ${color5.b}, 0.9); stop-opacity: 1;`
    );
    gradientElement.children[4].setAttribute("offset", `${offset5}%`);
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
    (char, i) => `<span style="transform:rotate(${i * 14}deg)">${char}</span>`
  )
  .join("");
