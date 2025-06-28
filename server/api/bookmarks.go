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
		fmt.Println("Importing")

		body := c.Body()
		fmt.Println("Raw body:", string(body)) // see the raw JSON you're receiving

		var bookmarks []db.InsertBookmarkParams

		if err := json.Unmarshal(body, &bookmarks); err != nil {
			fmt.Println("Unmarshal error:", err)
			return c.Status(400).SendString("Invalid JSON: " + err.Error())
		}

		fmt.Printf("Parsed bookmarks: %+v\n", bookmarks)

		for _, bm := range bookmarks {
			fmt.Printf("Inserting: %+v\n", bm)
			if err := q.InsertBookmark(c.Context(), bm); err != nil {
				fmt.Printf("Insert failed: %v\n", err)
				// optionally return 500 or continue
			}
		}

		return c.SendStatus(201)
	}
}
