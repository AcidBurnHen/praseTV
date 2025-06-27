export type Bookmark = {
  id: string
  title: string
  url: string | null
  parent_id: string | null
}

export async function fetchBookmarks(): Promise<Bookmark[]> {
  const res = await fetch('/api/bookmarks')
  if (!res.ok) throw new Error(`API error ${res.status}`)
  return res.json()
}
