package api

import (
	"encoding/json"
	"fmt"
	"prasetv-server/db"

	"github.com/gofiber/fiber/v2"
)

func ListBookmarks(q *db.Queries) fiber.Handler {
	return func(c *fiber.Ctx) error {
		bookmarks, err := q.ListBookmarks(c.Context())
		fmt.Println("Bookmarks: ", bookmarks)
		if err != nil {
			return c.Status(500).SendString(err.Error())
		}
		return c.JSON(bookmarks)
	}
}

func InsertBookmark(q *db.Queries) fiber.Handler {
	return func(c *fiber.Ctx) error {
		var bm db.InsertBookmarkParams
		if err := c.BodyParser(&bm); err != nil {
			return c.Status(400).SendString(err.Error())
		}
		if err := q.InsertBookmark(c.Context(), bm); err != nil {
			return c.Status(500).SendString(err.Error())
		}
		return c.SendStatus(201)
	}
}

func DeleteBookmark(q *db.Queries) fiber.Handler {
	return func(c *fiber.Ctx) error {
		id := c.Params("id")
		if err := q.DeleteBookmark(c.Context(), id); err != nil {
			return c.Status(500).SendString(err.Error())
		}
		return c.SendStatus(204)
	}
}

func ImportBookmarks(q *db.Queries) fiber.Handler {
	return func(c *fiber.Ctx) error {
		body := c.Body()

		var bookmarks []db.InsertBookmarkParams
		if err := json.Unmarshal(body, &bookmarks); err != nil {
			return c.Status(400).SendString("Invalid JSON: " + err.Error())
		}

		existing, err := q.ListBookmarks(c.Context())
		if err != nil {
			return c.Status(500).SendString(err.Error())
		}

		existingMap := make(map[string]db.Bookmark)
		for _, e := range existing {
			existingMap[e.ID] = e
		}

		incomingIDs := make(map[string]struct{})

		for _, bm := range bookmarks {
			incomingIDs[bm.ID] = struct{}{}
			if _, ok := existingMap[bm.ID]; ok {
				upd := db.UpdateBookmarkParams{ID: bm.ID, Title: bm.Title, Url: bm.Url}
				if err := q.UpdateBookmark(c.Context(), upd); err != nil {
					return c.Status(500).SendString(err.Error())
				}
			} else {
				if err := q.InsertBookmark(c.Context(), bm); err != nil {
					return c.Status(500).SendString(err.Error())
				}
			}
		}

		for id := range existingMap {
			if _, ok := incomingIDs[id]; !ok {
				if err := q.DeleteBookmark(c.Context(), id); err != nil {
					return c.Status(500).SendString(err.Error())
				}
			}
		}

		return c.SendStatus(200)
	}
}
