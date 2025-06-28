import { fetchBookmarks } from './bookmarks'
import type { Bookmark } from './bookmarks'


let allBookmarks: Bookmark[] = []
const searchInput = document.getElementById('bookmark-search') as HTMLInputElement

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


function getFaviconUrls(bookmarkUrl: string) {
  const { origin } = new URL(bookmarkUrl);
  if (!origin) {
    return [null, null]
  }

  return [`${origin}/favicon.ico`, `https://www.google.com/s2/favicons?sz=64&domain=${origin}`];
}

let focusedElement: HTMLElement  | null = null 
let totalElements = 0

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
  }

  focusedElement = elementToFocus
  focusedElement.classList.add('active_focus')
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

function handleKeyboardControls (e: KeyboardEvent) {
  if (!focusedElement && ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
    const firstELement = document.getElementById('bookmark-0')
    if (firstELement) {
      toggleFocusedElement(firstELement)
    }
  }

  console.log("Key: ", e.key)
  switch (e.key) {
    case 'Delete': {
      if (!focusedElement) {
        break 
      }
           
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

      window.open(url, '_blank')
      
      break 
    }
    case 'ArrowUp': {
      if (!focusedElement) {
        break 
      }

      const idx = Number(focusedElement.dataset.idx)
      if (idx < 4) {
        break; 
      }

      const newIdx = idx - 4
      const newElementToFocus = document.getElementById(`bookmark-${newIdx}`)
      if (newElementToFocus) {
        toggleFocusedElement(newElementToFocus)
      }

      break
    }
    case 'ArrowDown': {
      if (!focusedElement) {
        break 
      }

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
      if (!focusedElement) {
        break 
      }

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
      if (!focusedElement) {
        break 
      }

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

window.addEventListener('keydown', handleKeyboardControls)

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

fetchBookmarks()
  .then((bm) => {
    allBookmarks = bm
    renderBookmarksWithFilters()
  })
  .catch((err) => {
    console.error('Failed to load bookmarks:', err)
  })