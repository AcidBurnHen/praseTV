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

  bookmarks.forEach((bookmark: Bookmark) => {
    console.log("Book mark: ", bookmark)
    console.log("Bookmark Title: ", bookmark.Title)
    const container = document.createElement('div')
    const title = document.createElement('span')
    title.innerText = bookmark.Title
    
    if (bookmark.Url) {
      const url = document.createElement('a')
      url.href = bookmark.Url 

      const [faviconOriginal, faviconAlternative] = getFaviconUrls(bookmark.Url)
      if (faviconOriginal !== null) {
        const img = document.createElement('img')
        img.width = 30
        img.height = 30
        img.src = faviconOriginal 
        url.appendChild(img) 
      } 

      url.appendChild(title)
      container.appendChild(url)

    } else {
      container.appendChild(title)
    }
    
    list.appendChild(container)
  })

}

fetchBookmarks().then(render).catch(err => {
  console.error('Failed to load bookmarks:', err)
})