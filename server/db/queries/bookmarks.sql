-- name: ListBookmarks :many
SELECT * FROM bookmarks;

-- name: InsertBookmark :exec
INSERT INTO bookmarks (id, title, url, parent_id)
VALUES (?, ?, ?, ?);

-- name: DeleteBookmark :exec
DELETE FROM bookmarks WHERE id = ?;