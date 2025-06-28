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
