importScripts("sync.js");

chrome.runtime.onInstalled.addListener(() => {
  chrome.alarms.create("syncBookmarks", { periodInMinutes: 30 });

  console.log("Set sync")
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "syncBookmarks") {
    console.log("Alarm ran")
    syncBookmarks();
  }
});

chrome.action.onClicked.addListener(() => {
  console.log("Clicked")
  syncBookmarks();
});

chrome.bookmarks.onCreated.addListener(() => {
  console.log("Bookmark added");
  syncBookmarks();
});

syncBookmarks()