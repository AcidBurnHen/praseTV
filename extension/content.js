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
  if (!msg.action) {
    return 
  }

  // console.log("Got message: ", msg)
  switch (msg.action) {
    case 'deleteBookmark': {
      chrome.runtime.sendMessage({ action: 'deleteBookmark', id: msg.id })
      break 
    }
    case 'openBookmark': {
       chrome.runtime.sendMessage({ action: 'openBookmark', url: msg.url })
       break
    }
  }
});

document.addEventListener('keydown', (e) => {
  // Avoid hijacking any keyboard control on editable elements
  if (isEditableElement()) {
    return 
  }

  switch (e.key) {
    case 'Home': {
      chrome.runtime.sendMessage({ action: 'focusPraseTab' });
      break;
    }
  }
});
