package main

import (
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/jmoiron/sqlx"
	_ "github.com/mattn/go-sqlite3"

	"prasetv-server/api"
	"prasetv-server/db"
)

func main() {
	app := fiber.New()

	dbConn := sqlx.MustConnect("sqlite3", "./prasetv.db")
	queries := db.New(dbConn)

	app.Get("/api/bookmarks", api.ListBookmarks(queries))
	app.Post("/api/bookmarks", api.InsertBookmark(queries))
	app.Delete("/api/bookmarks/:id", api.DeleteBookmark(queries))
	app.Post("/api/bookmarks/import", api.ImportBookmarks(queries))

	log.Fatal(app.Listen(":3000"))
}
