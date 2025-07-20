export interface Project {
  id: string
  name: string
  budget: number
  startDate: string
  endDate?: string
  createdAt: string
  updatedAt: string
}

export interface Engineer {
  id: string
  name: string
  position: string
  hourlyRate: number
  createdAt: string
  updatedAt: string
}

export interface WorkLog {
  id: string
  engineerId: string
  projectId: string
  hours: number
  date: string
  description: string
  category: string
  type: 'PLANNED' | 'ACTUAL'
  createdAt: string
  updatedAt: string
}

export interface Transaction {
  id: string
  projectId: string
  type: 'INCOME' | 'EXPENSE'
  amount: number
  category: string
  date: string
  description: string
  createdAt: string
  updatedAt: string
}

export interface Dashboard {
  projectId: string
  budget: number
  income: number
  laborCost: number
  otherExpense: number
  balance: number
  budgetUsage: number
}

export interface CreateProjectFormData {
  name: string
  budget: number
  startDate: string
  endDate?: string
}

export interface CreateEngineerFormData {
  name: string
  position: string
  hourlyRate: number
}

export interface CreateWorkLogFormData {
  engineerId: string
  projectId: string
  hours: number
  date: string
  description: string
  category: string
  type: 'PLANNED' | 'ACTUAL'
}

export interface CreateTransactionFormData {
  projectId: string
  type: 'INCOME' | 'EXPENSE'
  amount: number
  category: string
  date: string
  description: string
}