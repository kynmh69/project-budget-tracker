import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { 
  Plus, 
  DollarSign, 
  TrendingUp, 
  Users, 
  Receipt,
  Calculator
} from 'lucide-react'
import { Project, Dashboard as DashboardData } from '@/types'
import { formatCurrency, formatPercentage } from '@/lib/utils'
import { ProjectManager } from './ProjectManager'
import { EngineerManager } from './EngineerManager'
import { WorkLogManager } from './WorkLogManager'
import { TransactionManager } from './TransactionManager'
import { projectApi, dashboardApi } from '@/lib/api'

interface DashboardProps {
  className?: string
}

export function Dashboard({ className }: DashboardProps) {
  const [projects, setProjects] = useState<Project[]>([])
  const [selectedProject, setSelectedProject] = useState<string>('')
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProjects()
  }, [])

  useEffect(() => {
    if (selectedProject) {
      loadDashboardData()
    }
  }, [selectedProject])

  const loadProjects = async () => {
    try {
      const data = await projectApi.getAll()
      setProjects(data)
      if (data.length > 0 && !selectedProject) {
        setSelectedProject(data[0].id)
      }
    } catch (error) {
      console.error('Failed to load projects:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadDashboardData = async () => {
    if (!selectedProject) return
    
    try {
      const data = await dashboardApi.getMetrics(selectedProject)
      setDashboardData(data)
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
    }
  }

  const getSelectedProjectName = () => {
    const project = projects.find(p => p.id === selectedProject)
    return project?.name || 'プロジェクトを選択'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-muted-foreground">読み込み中...</div>
      </div>
    )
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">プロジェクト予算管理</h1>
          <p className="text-muted-foreground">
            プロジェクトの予算、工数、収支を一元管理
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Select value={selectedProject} onValueChange={setSelectedProject}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="プロジェクトを選択" />
            </SelectTrigger>
            <SelectContent>
              {projects.map((project) => (
                <SelectItem key={project.id} value={project.id}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <ProjectManager onProjectCreated={loadProjects} />
        </div>
      </div>

      {selectedProject && dashboardData && (
        <>
          {/* Overview Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">予算</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(dashboardData.budget)}
                </div>
                <p className="text-xs text-muted-foreground">
                  プロジェクト総予算
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">収入</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(dashboardData.income)}
                </div>
                <p className="text-xs text-muted-foreground">
                  契約金・その他収入
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">人件費</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(dashboardData.laborCost)}
                </div>
                <p className="text-xs text-muted-foreground">
                  工数から自動計算
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">その他支出</CardTitle>
                <Receipt className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(dashboardData.otherExpense)}
                </div>
                <p className="text-xs text-muted-foreground">
                  ツール・その他費用
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">収支</CardTitle>
                <Calculator className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${
                  dashboardData.balance >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {formatCurrency(dashboardData.balance)}
                </div>
                <p className="text-xs text-muted-foreground">
                  収入 - 人件費 - その他支出
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Budget Progress */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>予算使用率</CardTitle>
                <span className="text-sm text-muted-foreground">
                  {formatPercentage(dashboardData.budgetUsage)}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <Progress value={dashboardData.budgetUsage} className="w-full" />
              <div className="flex justify-between text-sm text-muted-foreground mt-2">
                <span>使用済み: {formatCurrency(dashboardData.laborCost + dashboardData.otherExpense)}</span>
                <span>残り: {formatCurrency(dashboardData.budget - dashboardData.laborCost - dashboardData.otherExpense)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Tabs */}
          <Tabs defaultValue="worklogs" className="space-y-4">
            <TabsList>
              <TabsTrigger value="worklogs">工数管理</TabsTrigger>
              <TabsTrigger value="engineers">エンジニア管理</TabsTrigger>
              <TabsTrigger value="transactions">取引履歴</TabsTrigger>
            </TabsList>

            <TabsContent value="worklogs" className="space-y-4">
              <WorkLogManager 
                projectId={selectedProject} 
                onWorkLogChanged={loadDashboardData}
              />
            </TabsContent>

            <TabsContent value="engineers" className="space-y-4">
              <EngineerManager />
            </TabsContent>

            <TabsContent value="transactions" className="space-y-4">
              <TransactionManager 
                projectId={selectedProject}
                onTransactionChanged={loadDashboardData}
              />
            </TabsContent>
          </Tabs>
        </>
      )}

      {!selectedProject && (
        <Card>
          <CardContent className="flex items-center justify-center h-64">
            <div className="text-center space-y-4">
              <p className="text-lg text-muted-foreground">
                プロジェクトを作成または選択してください
              </p>
              <ProjectManager onProjectCreated={loadProjects} />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}