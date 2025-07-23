import { Project, Engineer, WorkLog, Transaction, Dashboard } from '@/types'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE}/api${endpoint}`
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  }

  const response = await fetch(url, config)
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }
  
  return response.json()
}

// Project API
export const projectApi = {
  getAll: () => request<Project[]>('/projects'),
  getById: (id: string) => request<Project>(`/projects/${id}`),
  create: (data: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) =>
    request<Project>('/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: string, data: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) =>
    request<Project>(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    request<void>(`/projects/${id}`, { method: 'DELETE' }),
}

// Engineer API
export const engineerApi = {
  getAll: () => request<Engineer[]>('/engineers'),
  getById: (id: string) => request<Engineer>(`/engineers/${id}`),
  create: (data: Omit<Engineer, 'id' | 'createdAt' | 'updatedAt'>) =>
    request<Engineer>('/engineers', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: string, data: Omit<Engineer, 'id' | 'createdAt' | 'updatedAt'>) =>
    request<Engineer>(`/engineers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    request<void>(`/engineers/${id}`, { method: 'DELETE' }),
}

// WorkLog API
export const workLogApi = {
  getAll: (projectId?: string, month?: string) => {
    const params = new URLSearchParams()
    if (projectId) params.append('projectId', projectId)
    if (month) params.append('month', month)
    const query = params.toString() ? `?${params.toString()}` : ''
    return request<WorkLog[]>(`/worklogs${query}`)
  },
  getById: (id: string) => request<WorkLog>(`/worklogs/${id}`),
  create: (data: Omit<WorkLog, 'id' | 'createdAt' | 'updatedAt'>) =>
    request<WorkLog>('/worklogs', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: string, data: Omit<WorkLog, 'id' | 'createdAt' | 'updatedAt'>) =>
    request<WorkLog>(`/worklogs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    request<void>(`/worklogs/${id}`, { method: 'DELETE' }),
}

// Transaction API
export const transactionApi = {
  getAll: (projectId?: string) => {
    const params = new URLSearchParams()
    if (projectId) params.append('projectId', projectId)
    const query = params.toString() ? `?${params.toString()}` : ''
    return request<Transaction[]>(`/transactions${query}`)
  },
  getById: (id: string) => request<Transaction>(`/transactions/${id}`),
  create: (data: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) =>
    request<Transaction>('/transactions', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: string, data: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) =>
    request<Transaction>(`/transactions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    request<void>(`/transactions/${id}`, { method: 'DELETE' }),
}

// Dashboard API
export const dashboardApi = {
  getMetrics: (projectId: string) => request<Dashboard>(`/dashboard/${projectId}`),
}