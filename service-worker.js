// Register the click handler before attempting any icon work.
chrome.action.onClicked.addListener((tab) => {
  if (!Number.isInteger(tab?.id)) return;

  chrome.tabs.remove(tab.id).catch((error) => {
    console.error("Could not close the current tab:", error);
  });
});

function makeXIcon(size) {
  const canvas = new OffscreenCanvas(size, size);
  const context = canvas.getContext("2d");

  if (!context) throw new Error("Could not create icon canvas");

  context.strokeStyle = "#e53935";
  context.lineWidth = Math.max(2, size / 7);
  context.lineCap = "round";

  const margin = size * 0.28;
  context.beginPath();
  context.moveTo(margin, margin);
  context.lineTo(size - margin, size - margin);
  context.moveTo(size - margin, margin);
  context.lineTo(margin, size - margin);
  context.stroke();

  return context.getImageData(0, 0, size, size);
}

async function setButtonIcon() {
  try {
    await chrome.action.setIcon({
      imageData: {
        16: makeXIcon(16),
        32: makeXIcon(32)
      }
    });
    await chrome.action.setTitle({ title: "Close current tab" });
  } catch (error) {
    // The close-tab button still works if this browser cannot draw the icon.
    console.warn("Could not set the extension icon:", error);
  }
}

chrome.runtime.onInstalled.addListener(setButtonIcon);
chrome.runtime.onStartup.addListener(setButtonIcon);
setButtonIcon();
