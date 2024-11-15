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

    // Calculate RGB values for dynamic gradients
    const red1 = Math.abs(Math.sin((angle * Math.PI) / 180) * 255);
    const green1 = Math.abs(Math.cos((angle * Math.PI) / 180) * 255);
    const blue1 = Math.abs(Math.sin(((angle + 90) * Math.PI) / 180) * 255);

    const red2 = Math.abs(Math.cos(((angle + 45) * Math.PI) / 180) * 255);
    const green2 = Math.abs(Math.sin(((angle + 45) * Math.PI) / 180) * 255);
    const blue2 = Math.abs(Math.cos(((angle + 90) * Math.PI) / 180) * 255);

    // Adjust offsets to create a "moving" gradient
    const offset1 = 50 + normalizedX * 20; // Centered around 50%, moves left/right
    const offset2 = 50 + normalizedY * 20; // Centered around 50%, moves up/down
    const offset3 = 75 + normalizedX * 10; // Subtle offset for depth

    // Update gradient stops
    gradientElement.children[0].setAttribute(
      "style",
      `stop-color: rgba(${red1}, ${green1}, ${blue1}, 0.9); stop-opacity: 1;`
    );
    gradientElement.children[0].setAttribute("offset", `${offset1}%`);

    gradientElement.children[1].setAttribute(
      "style",
      `stop-color: rgba(${red2}, ${green1}, ${blue1}, 0.7); stop-opacity: 0.8;`
    );
    gradientElement.children[1].setAttribute("offset", `${offset2}%`);

    gradientElement.children[2].setAttribute(
      "style",
      `stop-color: rgba(${red1}, ${green2}, ${blue2}, 0.5); stop-opacity: 0.6;`
    );
    gradientElement.children[2].setAttribute("offset", `${offset3}%`);

    gradientElement.children[3].setAttribute(
      "style",
      `stop-color: rgba(${red2}, ${green2}, ${blue1}, 0.4); stop-opacity: 0.5;`
    );
    gradientElement.children[3].setAttribute("offset", `${100 - offset2}%`);

    gradientElement.children[4].setAttribute(
      "style",
      `stop-color: rgba(${red1}, ${green2}, ${blue2}, 0.3); stop-opacity: 0.4;`
    );
    gradientElement.children[4].setAttribute("offset", `${100 - offset1}%`);
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
