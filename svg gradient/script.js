function Marqueertl(selector, speed) {
  const parentSelector = document.querySelector(selector);
  const clone = parentSelector.innerHTML;
  const firstElement = parentSelector.children[0];
  let i = 0;

  // Clone the content for seamless scrolling
  parentSelector.insertAdjacentHTML("beforeend", clone);
  parentSelector.insertAdjacentHTML("beforeend", clone);

  // Animation function using requestAnimationFrame
  function animate() {
    firstElement.style.marginLeft = `-${i}px`;
    if (i > firstElement.clientWidth) {
      i = 0; // Reset when content scrolls completely
    }
    i += speed; // Increment by speed
    requestAnimationFrame(animate); // Call the animation on the next frame
  }
  animate(); // Start the animation
}

function Marqueeltr(selector, speed) {
  const parentSelector = document.querySelector(selector);
  const clone = parentSelector.innerHTML;
  const firstElement = parentSelector.children[0];
  let i = firstElement.clientWidth; // Start scrolling from the right edge

  // Clone the content for seamless scrolling
  parentSelector.insertAdjacentHTML("beforeend", clone);
  parentSelector.insertAdjacentHTML("beforeend", clone);

  // Animation function using requestAnimationFrame
  function animate() {
    firstElement.style.marginLeft = `-${i}px`; // Move left
    if (i <= 0) {
      i = firstElement.clientWidth; // Reset to start position
    }
    i -= speed; // Decrease position
    requestAnimationFrame(animate); // Call the animation on the next frame
  }
  animate(); // Start the animation
}

// Start animations after the page is fully loaded
window.addEventListener("load", () => {
  Marqueertl(".text1", 0.5);
  Marqueertl(".text3", 0.5);
  Marqueertl(".text5", 0.5);
  Marqueertl(".text7", 0.5);
  Marqueertl(".text9", 0.5);
  Marqueertl(".text11", 0.5);
  Marqueeltr(".text2", 0.5);
  Marqueeltr(".text4", 0.5);
  Marqueeltr(".text6", 0.5);
  Marqueeltr(".text8", 0.5);
  Marqueeltr(".text10", 0.5);
  Marqueeltr(".text12", 0.5);
});

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
    const offset5 = 100; // Final stop stays at 100%

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

function calculatePosition(degree, radius) {
  const radians = (degree - 60) * (Math.PI / 180);
  return {
    x: radius * Math.cos(radians),
    y: radius * Math.sin(radians),
  };
}

// function moveText(element, startDegree, endDegree, duration) {
//   const radius = 300; // Radius of the circle-container
//   const startPos = calculatePosition(startDegree, radius);
//   const endPos = calculatePosition(endDegree, radius);
//   const keyframes = [
//     {
//       transform: `translate(${startPos.x}px, ${startPos.y}px) rotate(30deg)`,
//     },
//     {
//       transform: `translate(${endPos.x}px, ${endPos.y}px) rotate(30deg)`,
//     },
//   ];
//   element.animate(keyframes, {
//     duration: duration,
//     iterations: Infinity,
//     easing: "linear",
//   });
// }

document.addEventListener("DOMContentLoaded", () => {
  moveText(document.querySelector(".text1"), 269, 89, 10000);
  moveText(document.querySelector(".text2"), 94, 270, 10000);
  moveText(document.querySelector(".text3"), 279, 98, 10000);
  moveText(document.querySelector(".text4"), 260, 100, 10000);
  moveText(document.querySelector(".text5"), 105, 255, 10000);
  moveText(document.querySelector(".text6"), 125, 235, 10000);
  moveText(document.querySelector(".text7"), 125, 235, 10000);
  moveText(document.querySelector(".text8"), 125, 235, 10000);
  moveText(document.querySelector(".text9"), 125, 235, 10000);
  moveText(document.querySelector(".text10"), 125, 235, 10000);
});

//vanta elm design
document.addEventListener("DOMContentLoaded", function () {
  try {
    VANTA.WAVES({
      el: "#circle-elm",
      mouseControls: true,
      touchControls: true,
      gyroControls: true,
      minHeight: 200.0,
      minWidth: 200.0,
      scale: 1.0,
      scaleMobile: 1.0,
      color: 0x1e8fffc5, // Blue waves
      shininess: 50,
      waveHeight: 20,
      waveSpeed: 1,
    });
  } catch (error) {
    console.error("Vanta initialization error:", error);
  }
});
