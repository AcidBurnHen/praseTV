function isEditableElement(element = document.activeElement) {
  const tag = element.tagName;
  return (
    element.isContentEditable ||
    tag === "INPUT" ||
    tag === "TEXTAREA" ||
    tag === "SELECT"
  );
}

// ---------- Event Listeners ----------
window.addEventListener('message', (event) => {
  if (event.source !== window) return;

  const msg = event.data;
  console.log("Got message: ", msg)
  if (msg?.action === 'deleteBookmark') {
    chrome.runtime.sendMessage({ action: 'deleteBookmark', id: msg.id });
  }
});

document.addEventListener('keydown', (e) => {
  // Avoid hijacking any keyboard control on editable elements
  if (isEditableElement()) {
    return 
  }

  console.log("E: ", e.key)
    switch (e.key) {
      case 'Home': {
        chrome.runtime.sendMessage({ action: 'focusPraseTab' });
        break;
      }
  }
});
