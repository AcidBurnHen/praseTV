importScripts("sync.js");


function reloadPraseTV() {
  chrome.tabs.query({url: ['http://localhost:3000/*', 'http://localhost:5173/*']}, 
    (tabs) => {
      for (let i = 0; i < tabs.length; i++) {
        chrome.tabs.reload(tabs[i].id)
      }
    }
  )
}

// ---------------- Bookmark listeners ----------------
chrome.bookmarks.onCreated.addListener(() => {
  console.log("Bookmark added");
  syncBookmarks();

  reloadPraseTV()
});


chrome.bookmarks.onChanged.addListener((id, changeInfo) => {
  console.log("Bookmark changed:", changeInfo);
  syncBookmarks()
});

chrome.bookmarks.onRemoved.addListener((id, removeInfo) => {
  console.log("Bookmark deleted:", id, removeInfo);
  syncBookmarks(); 
});

syncBookmarks()


// ---------------- Add bookmark context menu ----------------
chrome.contextMenus.create({
  id: "add_new_bookmarker",
  title: "Add bookmark",
  contexts: ["all"],
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "add_new_bookmarker") {
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
  console.log("Got message: ", msg)

  if (msg.action === "createBookmark") {
    chrome.bookmarks.create({
      title: msg.title,
      url: msg.url
    });
  } else if (msg.action === "deleteBookmark") {
    chrome.bookmarks.remove(msg.id)
  }
});