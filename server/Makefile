# Makefile

APP_NAME=prasetv-server
BINARY=./bin/$(APP_NAME)
SRC_DIR=.
DB_FILE=./prasetv.db

.PHONY: all build run clean

all: build

build:
	go build -o $(BINARY) $(SRC_DIR)

run: build
	@DB_PATH=$(DB_FILE) $(BINARY)

clean:
	rm -f $(BINARY)
