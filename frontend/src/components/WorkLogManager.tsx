import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Plus, Clock, Edit, Trash2, Calendar } from 'lucide-react'
import { WorkLog, Engineer, CreateWorkLogFormData } from '@/types'
import { formatDate } from '@/lib/utils'
import { workLogApi, engineerApi } from '@/lib/api'

interface WorkLogManagerProps {
  projectId: string
  onWorkLogChanged: () => void
}

export function WorkLogManager({ projectId, onWorkLogChanged }: WorkLogManagerProps) {
  const [workLogs, setWorkLogs] = useState<WorkLog[]>([])
  const [engineers, setEngineers] = useState<Engineer[]>([])
  const [open, setOpen] = useState(false)
  const [editingWorkLog, setEditingWorkLog] = useState<WorkLog | null>(null)
  const [loading, setLoading] = useState(false)
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7) // YYYY-MM format
  )
  
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateWorkLogFormData>()

  const selectedEngineerId = watch('engineerId')
  const selectedType = watch('type')

  useEffect(() => {
    loadEngineers()
  }, [])

  useEffect(() => {
    if (projectId) {
      loadWorkLogs()
    }
  }, [projectId, selectedMonth])

  useEffect(() => {
    if (editingWorkLog) {
      setValue('engineerId', editingWorkLog.engineerId)
      setValue('hours', editingWorkLog.hours)
      setValue('date', editingWorkLog.date.split('T')[0])
      setValue('description', editingWorkLog.description)
      setValue('category', editingWorkLog.category)
      setValue('type', editingWorkLog.type)
      setOpen(true)
    }
  }, [editingWorkLog, setValue])

  const loadWorkLogs = async () => {
    try {
      const data = await workLogApi.getAll(projectId, selectedMonth)
      setWorkLogs(data)
    } catch (error) {
      console.error('Failed to load work logs:', error)
    }
  }

  const loadEngineers = async () => {
    try {
      const data = await engineerApi.getAll()
      setEngineers(data)
    } catch (error) {
      console.error('Failed to load engineers:', error)
    }
  }

  const onSubmit = async (data: CreateWorkLogFormData) => {
    setLoading(true)
    try {
      const workLogData = {
        ...data,
        projectId,
      }

      if (editingWorkLog) {
        await workLogApi.update(editingWorkLog.id, workLogData)
      } else {
        await workLogApi.create(workLogData)
      }
      
      reset()
      setOpen(false)
      setEditingWorkLog(null)
      loadWorkLogs()
      onWorkLogChanged()
    } catch (error) {
      console.error('Failed to save work log:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (workLog: WorkLog) => {
    setEditingWorkLog(workLog)
  }

  const handleDelete = async (workLog: WorkLog) => {
    if (confirm('この工数ログを削除しますか？')) {
      try {
        await workLogApi.delete(workLog.id)
        loadWorkLogs()
        onWorkLogChanged()
      } catch (error) {
        console.error('Failed to delete work log:', error)
      }
    }
  }

  const handleDialogClose = () => {
    setOpen(false)
    setEditingWorkLog(null)
    reset()
  }

  const getEngineerName = (engineerId: string) => {
    const engineer = engineers.find(e => e.id === engineerId)
    return engineer?.name || '不明'
  }

  const getTypeLabel = (type: string) => {
    return type === 'PLANNED' ? '予定' : '実績'
  }

  const getTypeColor = (type: string) => {
    return type === 'PLANNED' ? 'text-blue-600' : 'text-green-600'
  }

  const plannedHours = workLogs.filter(log => log.type === 'PLANNED').reduce((sum, log) => sum + log.hours, 0)
  const actualHours = workLogs.filter(log => log.type === 'ACTUAL').reduce((sum, log) => sum + log.hours, 0)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">工数管理</h2>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4" />
            <Input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-auto"
            />
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                工数追加
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>
                  {editingWorkLog ? '工数編集' : '新規工数追加'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="engineerId">エンジニア</Label>
                  <Select
                    value={selectedEngineerId}
                    onValueChange={(value) => setValue('engineerId', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="エンジニアを選択" />
                    </SelectTrigger>
                    <SelectContent>
                      {engineers.map((engineer) => (
                        <SelectItem key={engineer.id} value={engineer.id}>
                          {engineer.name} ({engineer.position})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.engineerId && (
                    <p className="text-sm text-red-500">{errors.engineerId.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hours">時間数</Label>
                  <Input
                    id="hours"
                    type="number"
                    step="0.5"
                    {...register('hours', { 
                      required: '時間数は必須です',
                      min: { value: 0, message: '時間数は0以上である必要があります' }
                    })}
                    placeholder="8"
                  />
                  {errors.hours && (
                    <p className="text-sm text-red-500">{errors.hours.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date">日付</Label>
                  <Input
                    id="date"
                    type="date"
                    {...register('date', { required: '日付は必須です' })}
                  />
                  {errors.date && (
                    <p className="text-sm text-red-500">{errors.date.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">作業内容</Label>
                  <Input
                    id="description"
                    {...register('description', { required: '作業内容は必須です' })}
                    placeholder="API開発、UI実装など"
                  />
                  {errors.description && (
                    <p className="text-sm text-red-500">{errors.description.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">カテゴリ</Label>
                  <Input
                    id="category"
                    {...register('category', { required: 'カテゴリは必須です' })}
                    placeholder="開発、設計、テストなど"
                  />
                  {errors.category && (
                    <p className="text-sm text-red-500">{errors.category.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">種別</Label>
                  <Select
                    value={selectedType}
                    onValueChange={(value) => setValue('type', value as 'PLANNED' | 'ACTUAL')}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="種別を選択" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PLANNED">予定</SelectItem>
                      <SelectItem value="ACTUAL">実績</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.type && (
                    <p className="text-sm text-red-500">{errors.type.message}</p>
                  )}
                </div>

                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleDialogClose}
                  >
                    キャンセル
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? '保存中...' : editingWorkLog ? '更新' : '追加'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">予定工数</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{plannedHours}h</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">実績工数</CardTitle>
            <Clock className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{actualHours}h</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">差異</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${
              actualHours - plannedHours > 0 ? 'text-red-600' : 'text-green-600'
            }`}>
              {actualHours - plannedHours > 0 ? '+' : ''}{actualHours - plannedHours}h
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Work Logs Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b">
                <tr>
                  <th className="text-left p-4">日付</th>
                  <th className="text-left p-4">エンジニア</th>
                  <th className="text-left p-4">時間</th>
                  <th className="text-left p-4">作業内容</th>
                  <th className="text-left p-4">カテゴリ</th>
                  <th className="text-left p-4">種別</th>
                  <th className="text-right p-4">操作</th>
                </tr>
              </thead>
              <tbody>
                {workLogs.map((workLog) => (
                  <tr key={workLog.id} className="border-b">
                    <td className="p-4">{formatDate(workLog.date)}</td>
                    <td className="p-4">{getEngineerName(workLog.engineerId)}</td>
                    <td className="p-4">{workLog.hours}h</td>
                    <td className="p-4">{workLog.description}</td>
                    <td className="p-4">{workLog.category}</td>
                    <td className="p-4">
                      <span className={getTypeColor(workLog.type)}>
                        {getTypeLabel(workLog.type)}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end space-x-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(workLog)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(workLog)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {workLogs.length === 0 && (
            <div className="flex items-center justify-center h-32">
              <p className="text-muted-foreground">
                工数データがありません
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}