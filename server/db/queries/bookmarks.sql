-- name: ListBookmarks :many
SELECT * FROM bookmarks;

-- name: InsertBookmark :exec
INSERT INTO bookmarks (id, title, url)
VALUES (?, ?, ?);

-- name: DeleteBookmark :exec
DELETE FROM bookmarks WHERE id = ?;