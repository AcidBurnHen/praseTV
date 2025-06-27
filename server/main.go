package main

import (
	"log"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/jmoiron/sqlx"
	_ "github.com/mattn/go-sqlite3"

	"prasetv-server/api"
	"prasetv-server/db"
)

func main() {
	app := fiber.New()

	app.Static("/", "./web")

	dbPath := os.Getenv("DB_PATH")
	if dbPath == "" {
		dbPath = "./prasetv.db"
	}
	dbConn := sqlx.MustConnect("sqlite3", dbPath)

	queries := db.New(dbConn)

	app.Get("/api/bookmarks", api.ListBookmarks(queries))
	app.Post("/api/bookmarks", api.InsertBookmark(queries))
	app.Delete("/api/bookmarks/:id", api.DeleteBookmark(queries))
	app.Post("/api/bookmarks/import", api.ImportBookmarks(queries))

	log.Fatal(app.Listen(":3000"))
}
