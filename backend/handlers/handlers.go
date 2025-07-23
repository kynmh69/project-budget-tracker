package handlers

import (
	"net/http"
	"strconv"
	"time"

	"project-budget-tracker/db"
	"project-budget-tracker/models"

	"github.com/labstack/echo/v4"
)

type Handler struct {
	client *db.PrismaClient
}

func NewHandler(client *db.PrismaClient) *Handler {
	return &Handler{client: client}
}

// Project handlers
func (h *Handler) GetProjects(c echo.Context) error {
	projects := []models.Project{
		{
			ID:        "1",
			Name:      "Sample Project",
			Budget:    1000000,
			StartDate: time.Now(),
			EndDate:   &time.Time{},
		},
	}
	return c.JSON(http.StatusOK, projects)
}

func (h *Handler) CreateProject(c echo.Context) error {
	var req models.CreateProjectRequest
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
	}

	project := models.Project{
		ID:        "new-" + strconv.FormatInt(time.Now().Unix(), 10),
		Name:      req.Name,
		Budget:    req.Budget,
		StartDate: req.StartDate,
		EndDate:   req.EndDate,
	}

	return c.JSON(http.StatusCreated, project)
}

func (h *Handler) GetProject(c echo.Context) error {
	id := c.Param("id")
	project := models.Project{
		ID:        id,
		Name:      "Sample Project",
		Budget:    1000000,
		StartDate: time.Now(),
		EndDate:   &time.Time{},
	}
	return c.JSON(http.StatusOK, project)
}

func (h *Handler) UpdateProject(c echo.Context) error {
	id := c.Param("id")
	var req models.UpdateProjectRequest
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
	}

	project := models.Project{
		ID:        id,
		Name:      req.Name,
		Budget:    req.Budget,
		StartDate: req.StartDate,
		EndDate:   req.EndDate,
	}

	return c.JSON(http.StatusOK, project)
}

func (h *Handler) DeleteProject(c echo.Context) error {
	return c.JSON(http.StatusOK, map[string]string{"message": "Project deleted"})
}

// Engineer handlers
func (h *Handler) GetEngineers(c echo.Context) error {
	engineers := []models.Engineer{
		{
			ID:         "1",
			Name:       "田中太郎",
			Position:   "シニアエンジニア",
			HourlyRate: 5000,
		},
		{
			ID:         "2",
			Name:       "佐藤花子",
			Position:   "エンジニア",
			HourlyRate: 4000,
		},
	}
	return c.JSON(http.StatusOK, engineers)
}

func (h *Handler) CreateEngineer(c echo.Context) error {
	var req models.CreateEngineerRequest
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
	}

	engineer := models.Engineer{
		ID:         "new-" + strconv.FormatInt(time.Now().Unix(), 10),
		Name:       req.Name,
		Position:   req.Position,
		HourlyRate: req.HourlyRate,
	}

	return c.JSON(http.StatusCreated, engineer)
}

func (h *Handler) GetEngineer(c echo.Context) error {
	id := c.Param("id")
	engineer := models.Engineer{
		ID:         id,
		Name:       "田中太郎",
		Position:   "シニアエンジニア",
		HourlyRate: 5000,
	}
	return c.JSON(http.StatusOK, engineer)
}

func (h *Handler) UpdateEngineer(c echo.Context) error {
	id := c.Param("id")
	var req models.UpdateEngineerRequest
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
	}

	engineer := models.Engineer{
		ID:         id,
		Name:       req.Name,
		Position:   req.Position,
		HourlyRate: req.HourlyRate,
	}

	return c.JSON(http.StatusOK, engineer)
}

func (h *Handler) DeleteEngineer(c echo.Context) error {
	return c.JSON(http.StatusOK, map[string]string{"message": "Engineer deleted"})
}

// WorkLog handlers
func (h *Handler) GetWorkLogs(c echo.Context) error {
	projectId := c.QueryParam("projectId")
	month := c.QueryParam("month")
	
	workLogs := []models.WorkLog{
		{
			ID:          "1",
			EngineerID:  "1",
			ProjectID:   projectId,
			Hours:       8,
			Date:        time.Now(),
			Description: "API開発",
			Category:    "開発",
			Type:        "ACTUAL",
		},
		{
			ID:          "2",
			EngineerID:  "2",
			ProjectID:   projectId,
			Hours:       6,
			Date:        time.Now(),
			Description: "UI実装",
			Category:    "開発",
			Type:        "PLANNED",
		},
	}
	return c.JSON(http.StatusOK, workLogs)
}

func (h *Handler) CreateWorkLog(c echo.Context) error {
	var req models.CreateWorkLogRequest
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
	}

	workLog := models.WorkLog{
		ID:          "new-" + strconv.FormatInt(time.Now().Unix(), 10),
		EngineerID:  req.EngineerID,
		ProjectID:   req.ProjectID,
		Hours:       req.Hours,
		Date:        req.Date,
		Description: req.Description,
		Category:    req.Category,
		Type:        req.Type,
	}

	return c.JSON(http.StatusCreated, workLog)
}

func (h *Handler) GetWorkLog(c echo.Context) error {
	id := c.Param("id")
	workLog := models.WorkLog{
		ID:          id,
		EngineerID:  "1",
		ProjectID:   "1",
		Hours:       8,
		Date:        time.Now(),
		Description: "API開発",
		Category:    "開発",
		Type:        "ACTUAL",
	}
	return c.JSON(http.StatusOK, workLog)
}

func (h *Handler) UpdateWorkLog(c echo.Context) error {
	id := c.Param("id")
	var req models.UpdateWorkLogRequest
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
	}

	workLog := models.WorkLog{
		ID:          id,
		EngineerID:  req.EngineerID,
		ProjectID:   req.ProjectID,
		Hours:       req.Hours,
		Date:        req.Date,
		Description: req.Description,
		Category:    req.Category,
		Type:        req.Type,
	}

	return c.JSON(http.StatusOK, workLog)
}

func (h *Handler) DeleteWorkLog(c echo.Context) error {
	return c.JSON(http.StatusOK, map[string]string{"message": "WorkLog deleted"})
}

// Transaction handlers
func (h *Handler) GetTransactions(c echo.Context) error {
	projectId := c.QueryParam("projectId")
	
	transactions := []models.Transaction{
		{
			ID:          "1",
			ProjectID:   projectId,
			Type:        "INCOME",
			Amount:      500000,
			Category:    "契約金",
			Date:        time.Now(),
			Description: "初期契約金",
		},
		{
			ID:          "2",
			ProjectID:   projectId,
			Type:        "EXPENSE",
			Amount:      50000,
			Category:    "ツール費用",
			Date:        time.Now(),
			Description: "開発ツール購入",
		},
	}
	return c.JSON(http.StatusOK, transactions)
}

func (h *Handler) CreateTransaction(c echo.Context) error {
	var req models.CreateTransactionRequest
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
	}

	transaction := models.Transaction{
		ID:          "new-" + strconv.FormatInt(time.Now().Unix(), 10),
		ProjectID:   req.ProjectID,
		Type:        req.Type,
		Amount:      req.Amount,
		Category:    req.Category,
		Date:        req.Date,
		Description: req.Description,
	}

	return c.JSON(http.StatusCreated, transaction)
}

func (h *Handler) GetTransaction(c echo.Context) error {
	id := c.Param("id")
	transaction := models.Transaction{
		ID:          id,
		ProjectID:   "1",
		Type:        "INCOME",
		Amount:      500000,
		Category:    "契約金",
		Date:        time.Now(),
		Description: "初期契約金",
	}
	return c.JSON(http.StatusOK, transaction)
}

func (h *Handler) UpdateTransaction(c echo.Context) error {
	id := c.Param("id")
	var req models.UpdateTransactionRequest
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
	}

	transaction := models.Transaction{
		ID:          id,
		ProjectID:   req.ProjectID,
		Type:        req.Type,
		Amount:      req.Amount,
		Category:    req.Category,
		Date:        req.Date,
		Description: req.Description,
	}

	return c.JSON(http.StatusOK, transaction)
}

func (h *Handler) DeleteTransaction(c echo.Context) error {
	return c.JSON(http.StatusOK, map[string]string{"message": "Transaction deleted"})
}

// Dashboard handler
func (h *Handler) GetDashboard(c echo.Context) error {
	projectId := c.Param("projectId")
	
	// Mock calculations - in real implementation, these would be calculated from database
	dashboard := models.Dashboard{
		ProjectID:    projectId,
		Budget:       1000000,
		Income:       500000,
		LaborCost:    320000,
		OtherExpense: 50000,
		Balance:      130000,
		BudgetUsage:  37.0,
	}

	return c.JSON(http.StatusOK, dashboard)
}