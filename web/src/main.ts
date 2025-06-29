import { fetchBookmarks } from './bookmarks'
import type { Bookmark } from './bookmarks'

let focusedElement: HTMLElement  | null = null 
let totalElements = 0
let allBookmarks: Bookmark[] = []

// ---------------- HELPERS ---------------- //
function isEditableElement(element: HTMLElement | null = null): boolean {
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

function getFaviconUrls(bookmarkUrl: string) {
  const { origin } = new URL(bookmarkUrl);
  if (!origin) {
    return [null, null]
  }

  return [`${origin}/favicon.ico`, `https://www.google.com/s2/favicons?sz=64&domain=${origin}`];
}


// ----------- SEARCH INPUT ----------- //
const searchInput = document.getElementById('bookmark-search') as HTMLInputElement

function handleInputKeyboardControls(e: KeyboardEvent) {
  if (!e.ctrlKey || !focusedElement || focusedElement.id !== 'bookmark-search') {
    return 
  }

  switch(e.key) {
    case 'ArrowDown': {
      e.preventDefault()
      const newElementToFocus = document.getElementById(`bookmark-0`)
      console.log("new element to focus: ", newElementToFocus)
      if (newElementToFocus) {
        toggleFocusedElement(newElementToFocus)
      }
      break 
      
    }
  }
}

searchInput.addEventListener('focus', () => {
  searchInput.focus()
  toggleFocusedElement(searchInput)
})

function renderBookmarksWithFilters() {
  const query = searchInput.value.trim().toLowerCase()
  if (!query) {
    render(allBookmarks)
    return
  }
  const filtered = allBookmarks.filter((b) =>
    b.Title.toLowerCase().includes(query) || b.Url.toLowerCase().includes(query)
  )

  if (filtered.length !== totalElements) {
    render(filtered)
  }
}

searchInput.addEventListener('input', renderBookmarksWithFilters)


// -------------- BOOKMARKS -------------- //
function getFocusedElementUrl(): null | string {
  if (!focusedElement) {
    return null 
  }

  const url = focusedElement.querySelector('a[href]')
  if (!url || !url.getAttribute('href')) {
    return null 
  }

  return url.getAttribute('href')
}

function toggleFocusedElement(elementToFocus: HTMLElement) {
  if (focusedElement) {
    focusedElement.classList.remove('active_focus')
    focusedElement.blur()
  }

  focusedElement = elementToFocus
  focusedElement.classList.add('active_focus')
  focusedElement.focus()
}

function reorderIdxOnBookmarks() {
  const allBookmarks = document.querySelectorAll("#bookmark-list .bookmark")
  if (!allBookmarks) {
    return 
  }

  for (let i = 0; i < allBookmarks.length; i++) {
    const bookmark = allBookmarks[i] as HTMLElement;
    bookmark.dataset.idx = String(i);
    bookmark.setAttribute('id', `bookmark-${i}`)
  }
}

function handleBookmarkKeyboardControls (e: KeyboardEvent) {
  if (!focusedElement || isEditableElement()) {
    console.log("? ")
    return 
  }

  console.log("Here")

  switch (e.key) {
    case 'Delete': {     
      window.postMessage({ action: 'deleteBookmark', id: focusedElement.dataset.bId }, '*')

      const deletedId = focusedElement.dataset.bId
      allBookmarks = allBookmarks.filter(b => String(b.ID) !== deletedId)

      let oldIdx = Number(focusedElement.dataset.idx)
      focusedElement.remove()
      totalElements--

      reorderIdxOnBookmarks()

      if (oldIdx >= totalElements) {
        oldIdx = totalElements - 1    
      } 

      const newElementToFocus = document.querySelector(`#bookmark-${oldIdx}`) as HTMLElement
      console.log("new focused element: ", newElementToFocus)
      if (newElementToFocus) {
        toggleFocusedElement(newElementToFocus)
      }


      break
    }
    case 'Enter': { 
      const url = getFocusedElementUrl()
      if (!url) {
        break 
      }

      window.postMessage({ action: 'openBookmark', url }, '*')
      
      break 
    }
    case 'ArrowUp': {
      if (!focusedElement || focusedElement.id === 'bookmark-search') {
        break 
      }
    
      const idx = Number(focusedElement.dataset.idx)
      // In first element 
      if (idx < 4) {
        toggleFocusedElement(searchInput)
        break
      }

      const newIdx = idx - 4
      const newElementToFocus = document.getElementById(`bookmark-${newIdx}`)
      if (newElementToFocus) {
        toggleFocusedElement(newElementToFocus)
      }

      break
    }
    case 'ArrowDown': {
      console.log("Focused element.id: ", focusedElement.id)
      if (e.ctrlKey && focusedElement.id == 'bookmark-search') {
        e.preventDefault()
        const newElementToFocus = document.getElementById(`bookmark-0`)
        console.log("new element to focus: ", newElementToFocus)
        if (newElementToFocus) {
          toggleFocusedElement(newElementToFocus)
        }
        break 
      }

      console.log("Nothing")

      const idx = Number(focusedElement.dataset.idx)
      const gridCount = Number(Math.ceil(totalElements / 4))
      
      let missingElements = 0
      if ((totalElements / 4) < gridCount) {
        missingElements = totalElements % 4 
      }

      const lastColumn = (totalElements + missingElements) - 4

      if (idx >= lastColumn) {
        break 
      }

      let newIdx = idx + 4

      if (newIdx >= totalElements && newIdx < totalElements + missingElements) {
        newIdx = newIdx - missingElements;
      } 

      const newElementToFocus = document.getElementById(`bookmark-${newIdx}`)
      if (newElementToFocus) {
        toggleFocusedElement(newElementToFocus)
      }

      break 
    }
    case 'ArrowLeft': {
      const idx = Number(focusedElement.dataset.idx)
      if (idx < 1) {
        break; 
      }

      const newIdx = idx - 1
      const newElementToFocus = document.getElementById(`bookmark-${newIdx}`)
      if (newElementToFocus) {
        toggleFocusedElement(newElementToFocus)
      }

      break
    }
    case 'ArrowRight': {
      const idx = Number(focusedElement.dataset.idx)
      if (idx >= totalElements - 1) {
        break; 
      }

      const newIdx = idx + 1
      const newElementToFocus = document.getElementById(`bookmark-${newIdx}`)
      if (newElementToFocus) {
        toggleFocusedElement(newElementToFocus)
      }

      break
    }
  }
}


function render(bookmarks: Bookmark[]) {
  // console.log("BOokmarks: ", bookmarks)

  focusedElement = null
  totalElements = 0

  const list = document.getElementById('bookmark-list')!
  list.innerHTML = ''

  bookmarks.forEach((bookmark: Bookmark, idx) => {
    // ~ Container ~ 
    const container = document.createElement('div')
    container.id = `bookmark-${idx}`
    container.dataset.idx = String(idx)
    container.dataset.bId = String(bookmark.ID)
    container.classList.add('bookmark')

    // ~ Delete button ~ // 
    const deleteButton = document.createElement('button')
    deleteButton.classList.add('remove_bookmark')
    deleteButton.innerText = 'X'
    deleteButton.onclick = (e: Event) => {
      e.preventDefault()
      window.postMessage({ action: 'deleteBookmark', id: bookmark.ID }, '*')
      container.remove()
      totalElements--

      allBookmarks = allBookmarks.filter(b => b.ID !== bookmark.ID)

      reorderIdxOnBookmarks()
    }

    container.appendChild(deleteButton)


    // ~ Url container ~ 
    const urlContainer = document.createElement('a')
    urlContainer.classList.add('bookmark_url')
    const title = document.createElement('span')
    title.innerText = bookmark.Title
    
    
    urlContainer.href = bookmark.Url 
    urlContainer.onclick = (e: Event) => {
      e.preventDefault()

      window.postMessage({ action: 'openBookmark', url: bookmark.Url }, '*')
    }

    const [faviconOriginal, faviconAlternative] = getFaviconUrls(bookmark.Url)
    if (faviconOriginal !== null) {
      const img = document.createElement('img')
      img.width = 50
      img.height = 50
      img.src = faviconOriginal 
      urlContainer.appendChild(img) 

      if (faviconAlternative !== null) {
        img.onerror = () => {
          img.onerror = null 
          img.src = faviconAlternative
        }
      }

    } 

    urlContainer.appendChild(title)
    container.appendChild(urlContainer)

    totalElements++
    list.appendChild(container)
  })

}


// ----------------- Global controls ----------------- // 
function handleGlobalKeyboardControls(e: KeyboardEvent) {
  if (!focusedElement && ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
    const firstELement = document.getElementById('bookmark-0')
    if (firstELement) {
      toggleFocusedElement(firstELement)
    }
  }

  if (focusedElement && focusedElement.id === 'bookmark-search') {
    handleInputKeyboardControls(e)
    return 
  } 

  handleBookmarkKeyboardControls(e)
}
window.addEventListener('keydown', handleGlobalKeyboardControls)

function handleGlobalClcik(e: Event) {
  const target = e.target as HTMLElement

  // Check if click is outside input 
  if (target !== searchInput && !searchInput.contains(target)) {
    // If a bookmark exists, focus back on it
    if (focusedElement && focusedElement.id !== 'bookmark-search') {
      focusedElement.focus()
      searchInput.blur()
      return
    }

    const firstBookmark = document.getElementById('bookmark-0')
    if (firstBookmark) {
      toggleFocusedElement(firstBookmark)
      searchInput.blur()
    }
  }
}

document.addEventListener('click', handleGlobalClcik)

// ----------------- Init ----------------- //
fetchBookmarks()
  .then((bm) => {
    allBookmarks = bm
    renderBookmarksWithFilters()
  })
  .catch((err) => {
    console.error('Failed to load bookmarks:', err)
  })