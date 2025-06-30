import globalState from "./global"
import { getFaviconUrls } from "./utils"

export type Bookmark = {
  ID: string
  Title: string
  Url: string 
}

export async function fetchBookmarks(): Promise<Bookmark[]> {
  const res = await fetch('/api/bookmarks')
  if (!res.ok) throw new Error(`API error ${res.status}`)
  return res.json()
}

export function reorderIdxOnBookmarks() {
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


export function renderBookmarks(bookmarks: Bookmark[]) {
  // console.log("BOokmarks: ", bookmarks)

  globalState.bookmarks.focused = null
  globalState.bookmarks.total = 0

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
      globalState.bookmarks.total--

      globalState.bookmarks.all = globalState.bookmarks.all.filter(b => b.ID !== bookmark.ID)

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

    globalState.bookmarks.total++
    list.appendChild(container)
  })

}