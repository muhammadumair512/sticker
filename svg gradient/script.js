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
    // Normalize and scale tilt values
    const normalizedX = x / 90; // Normalize x tilt to range [-1, 1]
    const normalizedY = y / 90; // Normalize y tilt to range [-1, 1]
    const angle = Math.atan2(normalizedY, normalizedX) * (180 / Math.PI);

    // Define base colors for the gradient
    const baseColor1 = { r: 255, g: 200, b: 150 }; // Soft peach
    const baseColor2 = { r: 200, g: 150, b: 255 }; // Lavender
    const baseColor3 = { r: 150, g: 255, b: 200 }; // Mint green
    const baseColor4 = { r: 255, g: 255, b: 200 }; // Pale yellow

    // Adjust colors dynamically based on the tilt angle
    const color1 = {
      r: Math.min(255, baseColor1.r + normalizedX * 50),
      g: Math.min(255, baseColor1.g + normalizedY * 50),
      b: Math.max(0, baseColor1.b - normalizedX * 30),
    };

    const color2 = {
      r: Math.max(0, baseColor2.r - normalizedY * 40),
      g: Math.min(255, baseColor2.g + normalizedX * 30),
      b: Math.min(255, baseColor2.b + normalizedY * 50),
    };

    const color3 = {
      r: Math.min(255, baseColor3.r + normalizedY * 40),
      g: Math.max(0, baseColor3.g - normalizedX * 50),
      b: Math.min(255, baseColor3.b + normalizedX * 30),
    };

    const color4 = {
      r: Math.min(255, baseColor4.r + normalizedX * 20),
      g: Math.min(255, baseColor4.g + normalizedY * 20),
      b: Math.max(0, baseColor4.b - normalizedY * 20),
    };

    // Adjust offsets to create a "moving" gradient
    const offset1 = 20 + normalizedX * 10; // Offset for stop 1
    const offset2 = 40 + normalizedY * 10; // Offset for stop 2
    const offset3 = 60 + normalizedX * 10; // Offset for stop 3
    const offset4 = 80 + normalizedY * 10; // Offset for stop 4

    // Update gradient stops
    gradientElement.children[0].setAttribute(
      "style",
      `stop-color: rgba(${color1.r}, ${color1.g}, ${color1.b}, 1); stop-opacity: 1;`
    );
    gradientElement.children[0].setAttribute("offset", `${offset1}%`);

    gradientElement.children[1].setAttribute(
      "style",
      `stop-color: rgba(${color2.r}, ${color2.g}, ${color2.b}, 1); stop-opacity: 0.9;`
    );
    gradientElement.children[1].setAttribute("offset", `${offset2}%`);

    gradientElement.children[2].setAttribute(
      "style",
      `stop-color: rgba(${color3.r}, ${color3.g}, ${color3.b}, 1); stop-opacity: 0.8;`
    );
    gradientElement.children[2].setAttribute("offset", `${offset3}%`);

    gradientElement.children[3].setAttribute(
      "style",
      `stop-color: rgba(${color4.r}, ${color4.g}, ${color4.b}, 1); stop-opacity: 0.7;`
    );
    gradientElement.children[3].setAttribute("offset", `${offset4}%`);
  });
}

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
