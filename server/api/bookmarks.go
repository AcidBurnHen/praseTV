package api

import (
	"prasetv-server/db"

	"github.com/gofiber/fiber/v2"
)

func ListBookmarks(q *db.Queries) fiber.Handler {
	return func(c *fiber.Ctx) error {
		bookmarks, err := q.ListBookmarks(c.Context())
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
		var bookmarks []db.InsertBookmarkParams
		if err := c.BodyParser(&bookmarks); err != nil {
			return c.Status(400).SendString(err.Error())
		}

		for _, bm := range bookmarks {
			_ = q.InsertBookmark(c.Context(), bm) // You can handle dupes better if needed
		}

		return c.SendStatus(201)
	}
}
