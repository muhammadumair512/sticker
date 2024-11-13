if (typeof DeviceMotionEvent.requestPermission === "function") {
  // For iOS 13+ devices, request permission to access motion data
  DeviceMotionEvent.requestPermission()
    .then((response) => {
      if (response === "granted") {
        startHolographicStickerEffect();
      } else {
        alert("Permission to access motion data was denied.");
      }
    })
    .catch(console.error);
} else {
  // Non-iOS devices that don't require explicit permission
  startHolographicStickerEffect();
}

function startMotionHandler(onMotionUpdate) {
  const isMacSafari =
    /^((?!chrome|android).)*safari/i.test(navigator.userAgent) &&
    navigator.platform.toUpperCase().indexOf("MAC") >= 0;

  if (isMacSafari) {
    // Simulate oscillation effect for Mac Safari
    let xPosition = 0;
    let yPosition = 0;
    let stepX = 0.1;
    let stepY = 0.1;

    setInterval(() => {
      xPosition += stepX;
      yPosition += stepY;

      // Reverse direction at boundaries
      if (xPosition >= 5 || xPosition <= -5) {
        stepX = -stepX;
      }
      if (yPosition >= 5 || yPosition <= -5) {
        stepY = -stepY;
      }

      // Call the update function with simulated values
      onMotionUpdate(xPosition, yPosition);
    }, 10);
  } else if (window.DeviceOrientationEvent) {
    // Apply motion effect for devices with motion sensors
    window.addEventListener("deviceorientation", function (event) {
      let gamma = event.gamma || 0;
      let beta = event.beta || 0;

      // Call the update function with actual motion values
      onMotionUpdate(gamma * mult_gamme, beta * mult_beta);
    });
  } else {
    alert("Device orientation not supported on this device/browser.");
  }
}

function startHolographicStickerEffect() {
  const holographicSticker = document.querySelector("#gradient1");
  // const stickerText = holographicSticker.querySelector(".stickerText");

  startMotionHandler((x, y) => {
    const updated_x = Math.abs(x * 1);
    const updated_y = y * 1;

    const angle = Math.atan2(updated_y, updated_x) * (180 / Math.PI);

    // Dynamically update the linear gradient angle
    holographicSticker.style.background = `radial-gradient(circle at 50% 50%,
            rgba(255, 255, 255, 0.5) 0%,
            rgba(255, 255, 255, 0.3) 25%,
            rgba(255, 255, 255, 0.1) 50%,
            rgba(255, 255, 255, 0) 75%) 50% 50%,
          radial-gradient(circle at 50% 50%,
            rgba(240, 230, 140, 0.3) 0%,
            rgba(250, 250, 210, 0.2) 30%,
            rgba(240, 230, 140, 0) 70%) 50% 50%,
          linear-gradient(${angle}deg, rgba(255, 154, 158, 0.7), rgba(250, 208, 196, 0.7), rgba(212, 252, 121, 0.7), rgba(150, 230, 161, 0.7), rgba(146, 169, 255, 0.7), rgba(255, 154, 158, 0.7))`;

    const colorShiftFactor = updated_x;
    const color1 = `hsl(${200 + colorShiftFactor * colorMultiplier}, 80%, 60%)`;
    const color2 = `hsl(${340 + colorShiftFactor * colorMultiplier}, 80%, 60%)`;

    // Apply a gradient text color effect to simulate a shifting holographic text
    stickerText.style.background = `linear-gradient(${angle}deg, ${color1}, ${color2})`;
    stickerText.style.webkitBackgroundClip = "text";
    stickerText.style.webkitTextFillColor = "transparent";

    // Log the current x and y values to the console for debugging
    console.log(
      `Holographic Sticker - X: ${updated_x}, Y: ${updated_y}, Color 1: ${color1}, Color 2: ${color2}`
    );
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
