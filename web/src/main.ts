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
    const container = document.createElement('a')
    container.id = `bookmark-${idx}`
    container.classList.add('bookmark')
    const title = document.createElement('span')
    title.innerText = bookmark.Title
    
    
    container.href = bookmark.Url 

    const [faviconOriginal, faviconAlternative] = getFaviconUrls(bookmark.Url)
    if (faviconOriginal !== null) {
      const img = document.createElement('img')
      img.width = 50
      img.height = 50
      img.src = faviconOriginal 
      container.appendChild(img) 
    } 

    container.appendChild(title)
    
    list.appendChild(container)
  })

}

fetchBookmarks().then(render).catch(err => {
  console.error('Failed to load bookmarks:', err)
})