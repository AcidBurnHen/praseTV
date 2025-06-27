import { fetchBookmarks } from './bookmarks'
import type { Bookmark } from './bookmarks'

function render(bookmarks: Bookmark[]) {
  const list = document.getElementById('bookmark-list')!
  list.innerHTML = ''

  for (const bm of bookmarks) {
    const li = document.createElement('li')
    li.innerHTML = `<strong>${bm.title}</strong>${
      bm.url ? ` — <a href="${bm.url}" target="_blank">${bm.url}</a>` : ''
    }`
    list.appendChild(li)
  }
}

fetchBookmarks().then(render).catch(err => {
  console.error('Failed to load bookmarks:', err)
})