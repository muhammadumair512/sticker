window.addEventListener("load", () => {
  EnableVanta();
  RotateText();
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
    // Normalize and scale tilt values
    const normalizedX = x / 45; // Adjust to make changes more noticeable
    const normalizedY = y / 45; // Adjust to make changes more noticeable
    const angle = Math.atan2(normalizedY, normalizedX) * (180 / Math.PI);
    // shadow adjustments
    const svgElement = document.querySelector("#svglogo");
    const shadowOffsetX = Math.round(Math.cos((angle * Math.PI) / 180) * 10); // Scale as needed
    const shadowOffsetY = Math.round(Math.sin((angle * Math.PI) / 180) * 10); // Scale as needed
    svgElement.style.filter = `drop-shadow(${shadowOffsetX}px ${shadowOffsetY}px 10px rgba(0, 0, 0, 0.5))`;
    // uptil here
    // Define base colors for the gradient (vibrant colors)
    const baseColor1 = { r: 255, g: 120, b: 90 }; // Vibrant red-orange
    const baseColor2 = { r: 90, g: 180, b: 255 }; // Sky blue
    const baseColor3 = { r: 120, g: 255, b: 150 }; // Bright green
    const baseColor4 = { r: 255, g: 240, b: 120 }; // Vibrant yellow

    // Amplify color changes for better visibility
    const color1 = {
      r: Math.min(255, baseColor1.r + normalizedX * 100),
      g: Math.min(255, baseColor1.g + normalizedY * 100),
      b: Math.max(0, baseColor1.b - normalizedX * 80),
    };

    const color2 = {
      r: Math.max(0, baseColor2.r - normalizedY * 90),
      g: Math.min(255, baseColor2.g + normalizedX * 80),
      b: Math.min(255, baseColor2.b + normalizedY * 100),
    };

    const color3 = {
      r: Math.min(255, baseColor3.r + normalizedY * 90),
      g: Math.max(0, baseColor3.g - normalizedX * 100),
      b: Math.min(255, baseColor3.b + normalizedX * 80),
    };

    const color4 = {
      r: Math.min(255, baseColor4.r + normalizedX * 50),
      g: Math.min(255, baseColor4.g + normalizedY * 50),
      b: Math.max(0, baseColor4.b - normalizedY * 50),
    };

    // Amplify offset shifts for more noticeable 3D motion
    const offset1 = 20 + normalizedX * 20; // Offset for stop 1
    const offset2 = 40 + normalizedY * 20; // Offset for stop 2
    const offset3 = 60 + normalizedX * 20; // Offset for stop 3
    const offset4 = 80 + normalizedY * 20; // Offset for stop 4

    // Update gradient stops with new colors and offsets
    gradientElement.children[0].setAttribute(
      "style",
      `stop-color: rgba(${color1.r}, ${color1.g}, ${color1.b}, 1); stop-opacity: 1;`
    );
    gradientElement.children[0].setAttribute(
      "offset",
      `${Math.min(100, offset1)}%`
    );

    gradientElement.children[1].setAttribute(
      "style",
      `stop-color: rgba(${color2.r}, ${color2.g}, ${color2.b}, 1); stop-opacity: 0.9;`
    );
    gradientElement.children[1].setAttribute(
      "offset",
      `${Math.min(100, offset2)}%`
    );

    gradientElement.children[2].setAttribute(
      "style",
      `stop-color: rgba(${color3.r}, ${color3.g}, ${color3.b}, 1); stop-opacity: 0.8;`
    );
    gradientElement.children[2].setAttribute(
      "offset",
      `${Math.min(100, offset3)}%`
    );

    gradientElement.children[3].setAttribute(
      "style",
      `stop-color: rgba(${color4.r}, ${color4.g}, ${color4.b}, 1); stop-opacity: 0.7;`
    );
    gradientElement.children[3].setAttribute(
      "offset",
      `${Math.min(100, offset4)}%`
    );
  });
}

function calculatePosition(degree, radius) {
  const radians = (degree - 60) * (Math.PI / 180);
  return {
    x: radius * Math.cos(radians),
    y: radius * Math.sin(radians),
  };
}
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
  // document.getElementById("request-permission").style.display = "block";
  document
    .getElementById("request-permission")
    .addEventListener("click", requestPermissionForiOS);
} else {
  // Directly add the event listener on non-iOS devices
  window.addEventListener("deviceorientation", handleOrientation);
}

// circle script
// const text = document.querySelector(".text p");
// text.innerHTML = text.innerText
//   .split("")
//   .map(
//     (char, i) => `<span style="transform:rotate(${i * 7}deg); ">${char}</span>`
//   )
//   .join("");

//vanta elm design

function EnableVanta() {
  const elm = document.querySelector("#circle-elm");
  elm.style.removeProperty("background-color");
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
}
// EnableVanta();

// rotating circle

function RotateText() {
  const elm = document.querySelector("#text");
  elm.style.display = "block";
  const circleType = new CircleType(document.getElementById("text"));

  // Set the text radius and direction. Note: setter methods are chainable.
  circleType.radius(10).dir(1);

  // Provide your own splitter function to handle emojis
  // @see https://github.com/orling/grapheme-splitter
  const splitter = new GraphemeSplitter();
  new CircleType(
    document.getElementById("text"),
    splitter.splitGraphemes.bind(splitter)
  );
}
