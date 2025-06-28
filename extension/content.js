window.addEventListener('message', (event) => {
  if (event.source !== window) return;

  const msg = event.data;
  console.log("Got message: ", msg)
  if (msg?.action === 'deleteBookmark') {
    chrome.runtime.sendMessage({ action: 'deleteBookmark', id: msg.id });
  }
});