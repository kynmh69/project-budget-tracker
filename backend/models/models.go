package models

import (
	"time"

	"gorm.io/gorm"
)

// Enums
type WorkLogType string

const (
	WorkLogTypePlanned WorkLogType = "PLANNED"
	WorkLogTypeActual  WorkLogType = "ACTUAL"
)

type TransactionType string

const (
	TransactionTypeIncome  TransactionType = "INCOME"
	TransactionTypeExpense TransactionType = "EXPENSE"
)

// Core GORM entities
type Project struct {
	gorm.Model
	Name         string        `json:"name"`
	Budget       float64       `json:"budget"`
	StartDate    time.Time     `json:"startDate"`
	EndDate      *time.Time    `json:"endDate,omitempty"`
	WorkLogs     []WorkLog     `json:"workLogs,omitempty" gorm:"foreignKey:ProjectID"`
	Transactions []Transaction `json:"transactions,omitempty" gorm:"foreignKey:ProjectID"`
}

type Engineer struct {
	gorm.Model
	Name       string    `json:"name"`
	Position   string    `json:"position"`
	HourlyRate float64   `json:"hourlyRate"`
	WorkLogs   []WorkLog `json:"workLogs,omitempty" gorm:"foreignKey:EngineerID"`
}

type WorkLog struct {
	gorm.Model
	EngineerID  uint          `json:"engineerId"`
	Engineer    Engineer      `json:"engineer,omitempty"`
	ProjectID   uint          `json:"projectId"`
	Project     Project       `json:"project,omitempty"`
	Hours       float64       `json:"hours"`
	Date        time.Time     `json:"date"`
	Description string        `json:"description"`
	Category    string        `json:"category"`
	Type        WorkLogType   `json:"type"` // PLANNED or ACTUAL
}

type Transaction struct {
	gorm.Model
	ProjectID   uint            `json:"projectId"`
	Project     Project         `json:"project,omitempty"`
	Type        TransactionType `json:"type"` // INCOME or EXPENSE
	Amount      float64         `json:"amount"`
	Category    string          `json:"category"`
	Date        time.Time       `json:"date"`
	Description string          `json:"description"`
}

// Dashboard model
type Dashboard struct {
	ProjectID    uint    `json:"projectId"`
	Budget       float64 `json:"budget"`
	Income       float64 `json:"income"`
	LaborCost    float64 `json:"laborCost"`
	OtherExpense float64 `json:"otherExpense"`
	Balance      float64 `json:"balance"`
	BudgetUsage  float64 `json:"budgetUsage"` // percentage
}

// Request models (DTOs)
type CreateProjectRequest struct {
	Name      string     `json:"name" validate:"required"`
	Budget    float64    `json:"budget" validate:"required,gt=0"`
	StartDate time.Time  `json:"startDate" validate:"required"`
	EndDate   *time.Time `json:"endDate,omitempty"`
}

type UpdateProjectRequest struct {
	Name      string     `json:"name"`
	Budget    float64    `json:"budget"`
	StartDate time.Time  `json:"startDate"`
	EndDate   *time.Time `json:"endDate,omitempty"`
}

type CreateEngineerRequest struct {
	Name       string  `json:"name" validate:"required"`
	Position   string  `json:"position" validate:"required"`
	HourlyRate float64 `json:"hourlyRate" validate:"required,gt=0"`
}

type UpdateEngineerRequest struct {
	Name       string  `json:"name"`
	Position   string  `json:"position"`
	HourlyRate float64 `json:"hourlyRate"`
}

type CreateWorkLogRequest struct {
	EngineerID  uint        `json:"engineerId" validate:"required"`
	ProjectID   uint        `json:"projectId" validate:"required"`
	Hours       float64     `json:"hours" validate:"required,gt=0"`
	Date        time.Time   `json:"date" validate:"required"`
	Description string      `json:"description" validate:"required"`
	Category    string      `json:"category" validate:"required"`
	Type        WorkLogType `json:"type" validate:"required,oneof=PLANNED ACTUAL"`
}

type UpdateWorkLogRequest struct {
	Hours       float64     `json:"hours"`
	Date        time.Time   `json:"date"`
	Description string      `json:"description"`
	Category    string      `json:"category"`
	Type        WorkLogType `json:"type" validate:"oneof=PLANNED ACTUAL"`
}

type CreateTransactionRequest struct {
	ProjectID   uint            `json:"projectId" validate:"required"`
	Type        TransactionType `json:"type" validate:"required,oneof=INCOME EXPENSE"`
	Amount      float64         `json:"amount" validate:"required,gt=0"`
	Category    string          `json:"category" validate:"required"`
	Date        time.Time       `json:"date" validate:"required"`
	Description string          `json:"description" validate:"required"`
}

type UpdateTransactionRequest struct {
	Type        TransactionType `json:"type" validate:"oneof=INCOME EXPENSE"`
	Amount      float64         `json:"amount"`
	Category    string          `json:"category"`
	Date        time.Time       `json:"date"`
	Description string          `json:"description"`
}