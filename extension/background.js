importScripts("sync.js");

chrome.runtime.onInstalled.addListener(() => {
  // Optional: set periodic sync every 30 mins
  chrome.alarms.create("syncBookmarks", { periodInMinutes: 30 });
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "syncBookmarks") {
    syncBookmarks();
  }
});

chrome.action.onClicked.addListener(() => {
  syncBookmarks();
});
