-- name: ListBookmarks :many
SELECT * FROM bookmarks;

-- name: InsertBookmark :exec
INSERT INTO bookmarks (id, title, url)
VALUES (?, ?, ?);

-- name: DeleteBookmark :exec
DELETE FROM bookmarks WHERE id = ?;

-- name: UpdateBookmark :exec
UPDATE bookmarks SET title = ?, url = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?