package db

import (
	"log"
	"project-budget-tracker/models"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var DB *gorm.DB

func InitDB() {
	var err error
	DB, err = gorm.Open(sqlite.Open("dev.db"), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	log.Println("Database connection established.")

	// Auto-migrate the schema
	err = DB.AutoMigrate(&models.Project{}, &models.Engineer{}, &models.WorkLog{}, &models.Transaction{})
	if err != nil {
		log.Fatal("Failed to auto-migrate database:", err)
	}

	log.Println("Database migrated.")
}
