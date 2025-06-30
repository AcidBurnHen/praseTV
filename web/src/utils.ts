import globalState from "./global"


export function toggleFocusedElement(elementToFocus: HTMLElement, focusedElement: HTMLElement | null = null): HTMLElement {
  if (focusedElement === elementToFocus) {
    return focusedElement
  }

  if (focusedElement) {
    focusedElement.classList.remove('active_focus')
    focusedElement.blur()
  }

  console.log("Element to fuc: ", elementToFocus.id)

  if (elementToFocus.id === globalState.bookmarks.sectionContainer.id) {
      if (globalState.bookmarks.focused !== null) {
        elementToFocus = globalState.bookmarks.focused
      } else {
        elementToFocus = document.getElementById('bookmark-0') as HTMLElement
      }
  }

  focusedElement = elementToFocus
  focusedElement.classList.add('active_focus')
  focusedElement.focus()

  if (globalState.focusedElement !== focusedElement) {
    globalState.focusedElement?.blur()
    globalState.focusedElement?.classList.remove('active_focus')
    globalState.focusedElement = focusedElement
  }
  
  return focusedElement
}


export function isEditableElement(element: HTMLElement | null = null): boolean {
  if (element === null) {
    element = document.activeElement as HTMLElement
  }

  const tag = element.tagName;
  return (
    element.isContentEditable ||
    tag === "INPUT" ||
    tag === "TEXTAREA" ||
    tag === "SELECT"
  );
}

export function getFaviconUrls(bookmarkUrl: string) {
  const { origin } = new URL(bookmarkUrl);
  if (!origin) {
    return [null, null]
  }

  return [`${origin}/favicon.ico`, `https://www.google.com/s2/favicons?sz=64&domain=${origin}`];
}


export function getFocusedElementUrl(focusedElement: HTMLElement): null | string {
  if (!focusedElement) {
    return null 
  }

  const url = focusedElement.querySelector('a[href]')
  if (!url || !url.getAttribute('href')) {
    return null 
  }

  return url.getAttribute('href')
}
