import { fetchBookmarks } from './bookmarks'
import type { Bookmark } from './bookmarks'


function getFaviconUrls(bookmarkUrl: string) {
  const { origin } = new URL(bookmarkUrl);
  if (!origin) {
    return [null, null]
  }

  return [`${origin}/favicon.ico`, `https://www.google.com/s2/favicons?sz=64&domain=${origin}`];
}

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

    list.appendChild(container)
  })

}

fetchBookmarks().then(render).catch(err => {
  console.error('Failed to load bookmarks:', err)
})