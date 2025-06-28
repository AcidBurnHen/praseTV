package main

import (
	"fmt"
	"log"
	"os"
	"path/filepath"

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
		dbPath = "prasetv.db"
	}

	absPath, err := filepath.Abs(dbPath)
	if err != nil {
		fmt.Println("Failed to resolve absolute path:", err)
	} else {
		fmt.Println("Using database at:", absPath)
	}

	dbConn := sqlx.MustConnect("sqlite3", absPath)

	queries := db.New(dbConn)

	app.Get("/api/bookmarks", api.ListBookmarks(queries))
	app.Post("/api/bookmarks", api.InsertBookmark(queries))
	app.Delete("/api/bookmarks/:id", api.DeleteBookmark(queries))
	app.Post("/api/bookmarks/import", api.ImportBookmarks(queries))

	log.Fatal(app.Listen(":3000"))
}
