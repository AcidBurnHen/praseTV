import { fetchBookmarks } from './bookmarks'
import type { Bookmark } from './bookmarks'


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

function handleKeyboardControls (e: KeyboardEvent) {
  if (!focusedElement && ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
    const firstELement = document.getElementById('bookmark-0')
    if (firstELement) {
      toggleFocusedElement(firstELement)
    }
  }

  switch (e.key) {
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
      console.log("Up")

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

  const list = document.getElementById('bookmark-list')!
  list.innerHTML = ''

  bookmarks.forEach((bookmark: Bookmark, idx) => {
    console.log("IDX: ", idx)
    console.log("Book mark: ", bookmark)
    console.log("Bookmark Title: ", bookmark.Title)
    // ~ Container ~ 
    const container = document.createElement('div')
    container.id = `bookmark-${idx}`
    container.dataset.idx = String(idx)
    container.classList.add('bookmark')

    // ~ Delete button ~ // 
    const deleteButton = document.createElement('button')
    deleteButton.classList.add('remove_bookmark')
    deleteButton.innerText = 'X'
    deleteButton.onclick = (e: Event) => {
      e.preventDefault()
      window.postMessage({ action: 'deleteBookmark', id: bookmark.ID }, '*')
      container.remove()
    }

    container.appendChild(deleteButton)


    // ~ Url container ~ 
    const urlContainer = document.createElement('a')
    urlContainer.classList.add('bookmark_url')
    const title = document.createElement('span')
    title.innerText = bookmark.Title
    
    
    urlContainer.href = bookmark.Url 

    const [faviconOriginal] = getFaviconUrls(bookmark.Url)
    if (faviconOriginal !== null) {
      const img = document.createElement('img')
      img.width = 50
      img.height = 50
      img.src = faviconOriginal 
      urlContainer.appendChild(img) 
    } 

    urlContainer.appendChild(title)
    container.appendChild(urlContainer)

    totalElements++
    list.appendChild(container)
  })

}

fetchBookmarks().then(render).catch(err => {
  console.error('Failed to load bookmarks:', err)
})