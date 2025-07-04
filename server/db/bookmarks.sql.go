// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.29.0
// source: bookmarks.sql

package db

import (
	"context"
)

const deleteBookmark = `-- name: DeleteBookmark :exec
DELETE FROM bookmarks WHERE id = ?
`

func (q *Queries) DeleteBookmark(ctx context.Context, id string) error {
	_, err := q.db.ExecContext(ctx, deleteBookmark, id)
	return err
}

const insertBookmark = `-- name: InsertBookmark :exec
INSERT INTO bookmarks (id, title, url)
VALUES (?, ?, ?)
`

type InsertBookmarkParams struct {
	ID    string
	Title string
	Url   string
}

func (q *Queries) InsertBookmark(ctx context.Context, arg InsertBookmarkParams) error {
	_, err := q.db.ExecContext(ctx, insertBookmark, arg.ID, arg.Title, arg.Url)
	return err
}

const listBookmarks = `-- name: ListBookmarks :many
SELECT id, title, url, parent_id, created_at, updated_at FROM bookmarks
`

func (q *Queries) ListBookmarks(ctx context.Context) ([]Bookmark, error) {
	rows, err := q.db.QueryContext(ctx, listBookmarks)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []Bookmark
	for rows.Next() {
		var i Bookmark
		if err := rows.Scan(
			&i.ID,
			&i.Title,
			&i.Url,
			&i.ParentID,
			&i.CreatedAt,
			&i.UpdatedAt,
		); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Close(); err != nil {
		return nil, err
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

const updateBookmark = `-- name: UpdateBookmark :exec
UPDATE bookmarks SET title = ?, url = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?
`

type UpdateBookmarkParams struct {
	Title string
	Url   string
	ID    string
}

func (q *Queries) UpdateBookmark(ctx context.Context, arg UpdateBookmarkParams) error {
	_, err := q.db.ExecContext(ctx, updateBookmark, arg.Title, arg.Url, arg.ID)
	return err
}
