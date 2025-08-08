package handlers

import (
	"net/http"
	"strconv"

	"project-budget-tracker/models"

	"github.com/labstack/echo/v4"
	"gorm.io/gorm"
)

type Handler struct {
	DB *gorm.DB
}

func NewHandler(db *gorm.DB) *Handler {
	return &Handler{DB: db}
}

// Project handlers
func (h *Handler) GetProjects(c echo.Context) error {
	var projects []models.Project
	if err := h.DB.Find(&projects).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}
	return c.JSON(http.StatusOK, projects)
}

func (h *Handler) CreateProject(c echo.Context) error {
	var req models.CreateProjectRequest
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
	}

	project := models.Project{
		Name:      req.Name,
		Budget:    req.Budget,
		StartDate: req.StartDate,
		EndDate:   req.EndDate,
	}

	if err := h.DB.Create(&project).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}
	return c.JSON(http.StatusCreated, project)
}

func (h *Handler) GetProject(c echo.Context) error {
	id := c.Param("id")
	var project models.Project
	if err := h.DB.Preload("WorkLogs").Preload("Transactions").First(&project, id).Error; err != nil {
		return c.JSON(http.StatusNotFound, map[string]string{"error": "Project not found"})
	}
	return c.JSON(http.StatusOK, project)
}

func (h *Handler) UpdateProject(c echo.Context) error {
	id := c.Param("id")
	var project models.Project
	if err := h.DB.First(&project, id).Error; err != nil {
		return c.JSON(http.StatusNotFound, map[string]string{"error": "Project not found"})
	}

	var req models.UpdateProjectRequest
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
	}

	h.DB.Model(&project).Updates(req)
	return c.JSON(http.StatusOK, project)
}

func (h *Handler) DeleteProject(c echo.Context) error {
	id := c.Param("id")
	if err := h.DB.Delete(&models.Project{}, id).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}
	return c.JSON(http.StatusOK, map[string]string{"message": "Project deleted"})
}

// Engineer handlers
func (h *Handler) GetEngineers(c echo.Context) error {
	var engineers []models.Engineer
	if err := h.DB.Find(&engineers).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}
	return c.JSON(http.StatusOK, engineers)
}

func (h *Handler) CreateEngineer(c echo.Context) error {
	var req models.CreateEngineerRequest
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
	}

	engineer := models.Engineer{
		Name:       req.Name,
		Position:   req.Position,
		HourlyRate: req.HourlyRate,
	}

	if err := h.DB.Create(&engineer).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}
	return c.JSON(http.StatusCreated, engineer)
}

func (h *Handler) GetEngineer(c echo.Context) error {
	id := c.Param("id")
	var engineer models.Engineer
	if err := h.DB.First(&engineer, id).Error; err != nil {
		return c.JSON(http.StatusNotFound, map[string]string{"error": "Engineer not found"})
	}
	return c.JSON(http.StatusOK, engineer)
}

func (h *Handler) UpdateEngineer(c echo.Context) error {
	id := c.Param("id")
	var engineer models.Engineer
	if err := h.DB.First(&engineer, id).Error; err != nil {
		return c.JSON(http.StatusNotFound, map[string]string{"error": "Engineer not found"})
	}

	var req models.UpdateEngineerRequest
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
	}

	h.DB.Model(&engineer).Updates(req)
	return c.JSON(http.StatusOK, engineer)
}

func (h *Handler) DeleteEngineer(c echo.Context) error {
	id := c.Param("id")
	if err := h.DB.Delete(&models.Engineer{}, id).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}
	return c.JSON(http.StatusOK, map[string]string{"message": "Engineer deleted"})
}

// WorkLog handlers
func (h *Handler) GetWorkLogs(c echo.Context) error {
	projectID := c.QueryParam("projectId")
	var workLogs []models.WorkLog
	query := h.DB
	if projectID != "" {
		query = query.Where("project_id = ?", projectID)
	}
	if err := query.Find(&workLogs).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}
	return c.JSON(http.StatusOK, workLogs)
}

func (h *Handler) CreateWorkLog(c echo.Context) error {
	var req models.CreateWorkLogRequest
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
	}

	workLog := models.WorkLog{
		EngineerID:  req.EngineerID,
		ProjectID:   req.ProjectID,
		Hours:       req.Hours,
		Date:        req.Date,
		Description: req.Description,
		Category:    req.Category,
		Type:        req.Type,
	}

	if err := h.DB.Create(&workLog).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}
	return c.JSON(http.StatusCreated, workLog)
}

func (h *Handler) GetWorkLog(c echo.Context) error {
	id := c.Param("id")
	var workLog models.WorkLog
	if err := h.DB.First(&workLog, id).Error; err != nil {
		return c.JSON(http.StatusNotFound, map[string]string{"error": "WorkLog not found"})
	}
	return c.JSON(http.StatusOK, workLog)
}

func (h *Handler) UpdateWorkLog(c echo.Context) error {
	id := c.Param("id")
	var workLog models.WorkLog
	if err := h.DB.First(&workLog, id).Error; err != nil {
		return c.JSON(http.StatusNotFound, map[string]string{"error": "WorkLog not found"})
	}

	var req models.UpdateWorkLogRequest
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
	}

	h.DB.Model(&workLog).Updates(req)
	return c.JSON(http.StatusOK, workLog)
}

func (h *Handler) DeleteWorkLog(c echo.Context) error {
	id := c.Param("id")
	if err := h.DB.Delete(&models.WorkLog{}, id).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}
	return c.JSON(http.StatusOK, map[string]string{"message": "WorkLog deleted"})
}

// Transaction handlers
func (h *Handler) GetTransactions(c echo.Context) error {
	projectID := c.QueryParam("projectId")
	var transactions []models.Transaction
	query := h.DB
	if projectID != "" {
		query = query.Where("project_id = ?", projectID)
	}
	if err := query.Find(&transactions).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}
	return c.JSON(http.StatusOK, transactions)
}

func (h *Handler) CreateTransaction(c echo.Context) error {
	var req models.CreateTransactionRequest
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
	}

	transaction := models.Transaction{
		ProjectID:   req.ProjectID,
		Type:        req.Type,
		Amount:      req.Amount,
		Category:    req.Category,
		Date:        req.Date,
		Description: req.Description,
	}

	if err := h.DB.Create(&transaction).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}
	return c.JSON(http.StatusCreated, transaction)
}

func (h *Handler) GetTransaction(c echo.Context) error {
	id := c.Param("id")
	var transaction models.Transaction
	if err := h.DB.First(&transaction, id).Error; err != nil {
		return c.JSON(http.StatusNotFound, map[string]string{"error": "Transaction not found"})
	}
	return c.JSON(http.StatusOK, transaction)
}

func (h *Handler) UpdateTransaction(c echo.Context) error {
	id := c.Param("id")
	var transaction models.Transaction
	if err := h.DB.First(&transaction, id).Error; err != nil {
		return c.JSON(http.StatusNotFound, map[string]string{"error": "Transaction not found"})
	}

	var req models.UpdateTransactionRequest
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
	}

	h.DB.Model(&transaction).Updates(req)
	return c.JSON(http.StatusOK, transaction)
}

func (h *Handler) DeleteTransaction(c echo.Context) error {
	id := c.Param("id")
	if err := h.DB.Delete(&models.Transaction{}, id).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}
	return c.JSON(http.StatusOK, map[string]string{"message": "Transaction deleted"})
}

// Dashboard handler
func (h *Handler) GetDashboard(c echo.Context) error {
	projectIDStr := c.Param("projectId")
	projectID, err := strconv.ParseUint(projectIDStr, 10, 32)
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid project ID"})
	}

	var project models.Project
	if err := h.DB.First(&project, projectID).Error; err != nil {
		return c.JSON(http.StatusNotFound, map[string]string{"error": "Project not found"})
	}

	var income float64
	h.DB.Model(&models.Transaction{}).Where("project_id = ? AND type = ?", projectID, models.TransactionTypeIncome).Select("SUM(amount)").Row().Scan(&income)

	var otherExpense float64
	h.DB.Model(&models.Transaction{}).Where("project_id = ? AND type = ?", projectID, models.TransactionTypeExpense).Select("SUM(amount)").Row().Scan(&otherExpense)

	var actualWorkLogs []models.WorkLog
	h.DB.Preload("Engineer").Where("project_id = ? AND type = ?", projectID, models.WorkLogTypeActual).Find(&actualWorkLogs)

	var laborCost float64
	for _, log := range actualWorkLogs {
		laborCost += log.Hours * log.Engineer.HourlyRate
	}

	balance := income - otherExpense - laborCost
	budgetUsage := 0.0
	if project.Budget > 0 {
		budgetUsage = (laborCost + otherExpense) / project.Budget * 100
	}

	dashboard := models.Dashboard{
		ProjectID:    uint(projectID),
		Budget:       project.Budget,
		Income:       income,
		LaborCost:    laborCost,
		OtherExpense: otherExpense,
		Balance:      balance,
		BudgetUsage:  budgetUsage,
	}

	return c.JSON(http.StatusOK, dashboard)
}