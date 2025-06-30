import { fetchBookmarks, renderBookmarks } from './bookmarks'
import { toggleFocusedElement } from './utils'
import globalState from './global'
import { handleGlobalKeyboardControls } from './keybindings'


// ----------- SEARCH INPUT ----------- //
globalState.search.inputElement.addEventListener('focus', () => {
  toggleFocusedElement(globalState.search.inputElement)
})

function renderBookmarksWithFilters() {
  const query = globalState.search.inputElement.value.trim().toLowerCase()
  if (!query) {
    renderBookmarks(globalState.bookmarks.all)
    return
  }
  const filtered = globalState.bookmarks.all.filter((b) =>
    b.Title.toLowerCase().includes(query) || b.Url.toLowerCase().includes(query)
  )

  if (filtered.length !== globalState.bookmarks.total) {
    renderBookmarks(filtered)
  }
}

globalState.search.inputElement.addEventListener('input', renderBookmarksWithFilters)



// ----------------- Global controls ----------------- // 
function handleGlobalClick(e: Event) {
  const target = e.target as HTMLElement

  // Check if click is outside input 
  if (target !== globalState.search.inputElement && !globalState.search.inputElement.contains(target)) {
    // If a bookmark exists, focus back on it
    if (globalState.bookmarks.focused) {
      toggleFocusedElement(globalState.bookmarks.focused)
      globalState.focusedSection = globalState.bookmarks.sectionContainer
      return
    }

    const firstBookmark = document.getElementById('bookmark-0')
    if (firstBookmark) {
      toggleFocusedElement(firstBookmark)
      globalState.focusedSection = globalState.bookmarks.sectionContainer
    }
  }
}

document.addEventListener('click', handleGlobalClick)
window.addEventListener('keydown', handleGlobalKeyboardControls)

// ----------------- Init ----------------- //
fetchBookmarks()
  .then((bm) => {
    globalState.bookmarks.all = bm
    renderBookmarksWithFilters()
  })
  .catch((err) => {
    console.error('Failed to load bookmarks:', err)
  })