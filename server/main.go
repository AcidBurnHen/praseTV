package main

import (
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/jmoiron/sqlx"
	_ "github.com/mattn/go-sqlite3"

	"prasetv-server/api"
)

func main() {
	app := fiber.New()

	db := sqlx.MustConnect("sqlite3", "./prasetv.db")
	queries := db_generated.New(db)

	app.Get("/api/bookmarks", api.ListBookmarks(queries))
	app.Post("/api/bookmarks", api.InsertBookmark(queries))
	app.Delete("/api/bookmarks/:id", api.DeleteBookmark(queries))

	log.Fatal(app.Listen(":3000"))
}
