// Color changer script based on hue variation
//
// version 1.0.0
//
// HSLToRGB function from https://css-tricks.com/converting-color-spaces-in-javascript/

const startHue = 211;
const waitTime = 100;

var currentHue = 0;

window.addEventListener("load", InitializeColor);

function InitializeColor() {
  currentHue = startHue;
  window.setTimeout(ChangeColor, 2000);
}

function ChangeColor() {
  currentHue++;
  if (currentHue >= 360) {
    currentHue = 0;
  }
  rgb = HSLToRGB(currentHue, 100, 50);
  rgb_lighter = HSLToRGB(currentHue, 100, 85);
  rgb_darker = HSLToRGB(currentHue, 100, 15);

  const cssroot = document.querySelector(':root');
  cssroot.style.setProperty('--c-main', rgb);

  window.setTimeout(ChangeColor, waitTime);
}

// https://css-tricks.com/converting-color-spaces-in-javascript/
function HSLToRGB(h,s,l) {
  // Must be fractions of 1
  s /= 100;
  l /= 100;

  let c = (1 - Math.abs(2 * l - 1)) * s,
      x = c * (1 - Math.abs((h / 60) % 2 - 1)),
      m = l - c/2,
      r = 0,
      g = 0,
      b = 0;

    if (0 <= h && h < 60) {
      r = c; g = x; b = 0;
    } else if (60 <= h && h < 120) {
      r = x; g = c; b = 0;
    } else if (120 <= h && h < 180) {
      r = 0; g = c; b = x;
    } else if (180 <= h && h < 240) {
      r = 0; g = x; b = c;
    } else if (240 <= h && h < 300) {
      r = x; g = 0; b = c;
    } else if (300 <= h && h < 360) {
      r = c; g = 0; b = x;
    }
    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);

    return "rgb(" + r + "," + g + "," + b + ")";
  }
