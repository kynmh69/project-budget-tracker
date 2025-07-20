package models

import "time"

// Core entities
type Project struct {
	ID        string     `json:"id"`
	Name      string     `json:"name"`
	Budget    float64    `json:"budget"`
	StartDate time.Time  `json:"startDate"`
	EndDate   *time.Time `json:"endDate,omitempty"`
	CreatedAt time.Time  `json:"createdAt"`
	UpdatedAt time.Time  `json:"updatedAt"`
}

type Engineer struct {
	ID         string    `json:"id"`
	Name       string    `json:"name"`
	Position   string    `json:"position"`
	HourlyRate float64   `json:"hourlyRate"`
	CreatedAt  time.Time `json:"createdAt"`
	UpdatedAt  time.Time `json:"updatedAt"`
}

type WorkLog struct {
	ID          string    `json:"id"`
	EngineerID  string    `json:"engineerId"`
	ProjectID   string    `json:"projectId"`
	Hours       float64   `json:"hours"`
	Date        time.Time `json:"date"`
	Description string    `json:"description"`
	Category    string    `json:"category"`
	Type        string    `json:"type"` // PLANNED or ACTUAL
	CreatedAt   time.Time `json:"createdAt"`
	UpdatedAt   time.Time `json:"updatedAt"`
}

type Transaction struct {
	ID          string    `json:"id"`
	ProjectID   string    `json:"projectId"`
	Type        string    `json:"type"` // INCOME or EXPENSE
	Amount      float64   `json:"amount"`
	Category    string    `json:"category"`
	Date        time.Time `json:"date"`
	Description string    `json:"description"`
	CreatedAt   time.Time `json:"createdAt"`
	UpdatedAt   time.Time `json:"updatedAt"`
}

// Dashboard model
type Dashboard struct {
	ProjectID    string  `json:"projectId"`
	Budget       float64 `json:"budget"`
	Income       float64 `json:"income"`
	LaborCost    float64 `json:"laborCost"`
	OtherExpense float64 `json:"otherExpense"`
	Balance      float64 `json:"balance"`
	BudgetUsage  float64 `json:"budgetUsage"` // percentage
}

// Request models
type CreateProjectRequest struct {
	Name      string     `json:"name" validate:"required"`
	Budget    float64    `json:"budget" validate:"required,gt=0"`
	StartDate time.Time  `json:"startDate" validate:"required"`
	EndDate   *time.Time `json:"endDate,omitempty"`
}

type UpdateProjectRequest struct {
	Name      string     `json:"name" validate:"required"`
	Budget    float64    `json:"budget" validate:"required,gt=0"`
	StartDate time.Time  `json:"startDate" validate:"required"`
	EndDate   *time.Time `json:"endDate,omitempty"`
}

type CreateEngineerRequest struct {
	Name       string  `json:"name" validate:"required"`
	Position   string  `json:"position" validate:"required"`
	HourlyRate float64 `json:"hourlyRate" validate:"required,gt=0"`
}

type UpdateEngineerRequest struct {
	Name       string  `json:"name" validate:"required"`
	Position   string  `json:"position" validate:"required"`
	HourlyRate float64 `json:"hourlyRate" validate:"required,gt=0"`
}

type CreateWorkLogRequest struct {
	EngineerID  string    `json:"engineerId" validate:"required"`
	ProjectID   string    `json:"projectId" validate:"required"`
	Hours       float64   `json:"hours" validate:"required,gt=0"`
	Date        time.Time `json:"date" validate:"required"`
	Description string    `json:"description" validate:"required"`
	Category    string    `json:"category" validate:"required"`
	Type        string    `json:"type" validate:"required,oneof=PLANNED ACTUAL"`
}

type UpdateWorkLogRequest struct {
	EngineerID  string    `json:"engineerId" validate:"required"`
	ProjectID   string    `json:"projectId" validate:"required"`
	Hours       float64   `json:"hours" validate:"required,gt=0"`
	Date        time.Time `json:"date" validate:"required"`
	Description string    `json:"description" validate:"required"`
	Category    string    `json:"category" validate:"required"`
	Type        string    `json:"type" validate:"required,oneof=PLANNED ACTUAL"`
}

type CreateTransactionRequest struct {
	ProjectID   string    `json:"projectId" validate:"required"`
	Type        string    `json:"type" validate:"required,oneof=INCOME EXPENSE"`
	Amount      float64   `json:"amount" validate:"required,gt=0"`
	Category    string    `json:"category" validate:"required"`
	Date        time.Time `json:"date" validate:"required"`
	Description string    `json:"description" validate:"required"`
}

type UpdateTransactionRequest struct {
	ProjectID   string    `json:"projectId" validate:"required"`
	Type        string    `json:"type" validate:"required,oneof=INCOME EXPENSE"`
	Amount      float64   `json:"amount" validate:"required,gt=0"`
	Category    string    `json:"category" validate:"required"`
	Date        time.Time `json:"date" validate:"required"`
	Description string    `json:"description" validate:"required"`
}