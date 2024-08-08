// Function to calculate the remaining time until 5 PM
function getTimeUntilFivePM() {
  const now = new Date();
  const fivePM = new Date();
  fivePM.setHours(1, 11, 0, 0); // Set the time to 5 PM today

  if (now > fivePM) {
    // If it's already past 5 PM, set the target to 5 PM tomorrow
    fivePM.setDate(fivePM.getDate() + 1);
  }

  return fivePM - now; // Returns the difference in milliseconds
}

// Function to set an alarm for 5 PM
function setAlarmForFivePM() {
  const timeUntilFivePM = getTimeUntilFivePM();
  chrome.alarms.create("fivePMAlarm", { when: Date.now() + timeUntilFivePM });
}

// Listener for the alarm
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "fivePMAlarm") {
    chrome.notifications.create("timeReached", {
      type: "basic",
      iconUrl: "icon.png",
      title: "Time Tracker",
      message: "It is now 5 PM!",
    });

    // Reset the alarm for the next day
    setAlarmForFivePM();
  }
});

// Listener for messages from the popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "startTimer") {
    setAlarmForFivePM();
    sendResponse({ status: "Timer started" });
  }
});
