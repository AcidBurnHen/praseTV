importScripts("sync.js");

// ------------------- Bookmark listeners 
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


chrome.bookmarks.onCreated.addListener(() => {
  console.log("Bookmark added");
  syncBookmarks();
});


chrome.bookmarks.onChanged.addListener((id, changeInfo) => {
  console.log("Bookmark changed:", changeInfo);
  syncBookmarks
});

chrome.bookmarks.onRemoved.addListener((id, removeInfo) => {
  console.log("Bookmark deleted:", id, removeInfo);
  syncBookmarks(); 
});

syncBookmarks()


// ---------------- Add bookmark context menu 
chrome.contextMenus.create({
  id: "add_new_bookmark",
  title: "Add bookmark",
  contexts: ["all"],
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "add_new_bookmark") {
    const targetUrl = info.linkUrl || tab.url;
    
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["injectBookmarkUI.js"]
      }, () => {
       
        if (chrome.runtime.lastError) {
          console.error("Script injection failed:", chrome.runtime.lastError);
          return;
        }

        chrome.tabs.sendMessage(tab.id, {
          action: "showBookmarkUI",
          url: targetUrl,
          title: tab.title || ""
        });
      });
  }
});

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.action === "createBookmark") {
    chrome.bookmarks.create({
      title: msg.title,
      url: msg.url
    });
  }
});