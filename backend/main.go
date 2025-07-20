package main

import (
	"context"
	"log"
	"net/http"
	"os"

	"project-budget-tracker/handlers"
	"project-budget-tracker/db"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

func main() {
	// Initialize database
	client := db.NewClient()
	if err := client.Prisma.Connect(); err != nil {
		log.Fatal("Failed to connect to database:", err)
	}
	defer func() {
		if err := client.Prisma.Disconnect(); err != nil {
			log.Println("Failed to disconnect from database:", err)
		}
	}()

	// Create Echo instance
	e := echo.New()

	// Middleware
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())
	e.Use(middleware.CORS())

	// Initialize handlers
	h := handlers.NewHandler(client)

	// Routes
	api := e.Group("/api")

	// Project routes
	api.GET("/projects", h.GetProjects)
	api.POST("/projects", h.CreateProject)
	api.GET("/projects/:id", h.GetProject)
	api.PUT("/projects/:id", h.UpdateProject)
	api.DELETE("/projects/:id", h.DeleteProject)

	// Engineer routes
	api.GET("/engineers", h.GetEngineers)
	api.POST("/engineers", h.CreateEngineer)
	api.GET("/engineers/:id", h.GetEngineer)
	api.PUT("/engineers/:id", h.UpdateEngineer)
	api.DELETE("/engineers/:id", h.DeleteEngineer)

	// WorkLog routes
	api.GET("/worklogs", h.GetWorkLogs)
	api.POST("/worklogs", h.CreateWorkLog)
	api.GET("/worklogs/:id", h.GetWorkLog)
	api.PUT("/worklogs/:id", h.UpdateWorkLog)
	api.DELETE("/worklogs/:id", h.DeleteWorkLog)

	// Transaction routes
	api.GET("/transactions", h.GetTransactions)
	api.POST("/transactions", h.CreateTransaction)
	api.GET("/transactions/:id", h.GetTransaction)
	api.PUT("/transactions/:id", h.UpdateTransaction)
	api.DELETE("/transactions/:id", h.DeleteTransaction)

	// Dashboard routes
	api.GET("/dashboard/:projectId", h.GetDashboard)

	// Health check
	e.GET("/health", func(c echo.Context) error {
		return c.JSON(http.StatusOK, map[string]string{"status": "ok"})
	})

	// Start server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	
	log.Printf("Server starting on port %s", port)
	log.Fatal(e.Start(":" + port))
}