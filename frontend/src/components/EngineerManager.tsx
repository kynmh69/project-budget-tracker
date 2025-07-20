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
import { Plus, User, Edit, Trash2 } from 'lucide-react'
import { Engineer, CreateEngineerFormData } from '@/types'
import { formatCurrency } from '@/lib/utils'
import { engineerApi } from '@/lib/api'

export function EngineerManager() {
  const [engineers, setEngineers] = useState<Engineer[]>([])
  const [open, setOpen] = useState(false)
  const [editingEngineer, setEditingEngineer] = useState<Engineer | null>(null)
  const [loading, setLoading] = useState(false)
  
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CreateEngineerFormData>()

  useEffect(() => {
    loadEngineers()
  }, [])

  useEffect(() => {
    if (editingEngineer) {
      setValue('name', editingEngineer.name)
      setValue('position', editingEngineer.position)
      setValue('hourlyRate', editingEngineer.hourlyRate)
      setOpen(true)
    }
  }, [editingEngineer, setValue])

  const loadEngineers = async () => {
    try {
      const data = await engineerApi.getAll()
      setEngineers(data)
    } catch (error) {
      console.error('Failed to load engineers:', error)
    }
  }

  const onSubmit = async (data: CreateEngineerFormData) => {
    setLoading(true)
    try {
      if (editingEngineer) {
        await engineerApi.update(editingEngineer.id, data)
      } else {
        await engineerApi.create(data)
      }
      
      reset()
      setOpen(false)
      setEditingEngineer(null)
      loadEngineers()
    } catch (error) {
      console.error('Failed to save engineer:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (engineer: Engineer) => {
    setEditingEngineer(engineer)
  }

  const handleDelete = async (engineer: Engineer) => {
    if (confirm(`${engineer.name}を削除しますか？`)) {
      try {
        await engineerApi.delete(engineer.id)
        loadEngineers()
      } catch (error) {
        console.error('Failed to delete engineer:', error)
      }
    }
  }

  const handleDialogClose = () => {
    setOpen(false)
    setEditingEngineer(null)
    reset()
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">エンジニア管理</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              エンジニア追加
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {editingEngineer ? 'エンジニア編集' : '新規エンジニア追加'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">名前</Label>
                <Input
                  id="name"
                  {...register('name', { required: '名前は必須です' })}
                  placeholder="田中太郎"
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="position">役職</Label>
                <Input
                  id="position"
                  {...register('position', { required: '役職は必須です' })}
                  placeholder="シニアエンジニア"
                />
                {errors.position && (
                  <p className="text-sm text-red-500">{errors.position.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="hourlyRate">時給</Label>
                <Input
                  id="hourlyRate"
                  type="number"
                  {...register('hourlyRate', { 
                    required: '時給は必須です',
                    min: { value: 0, message: '時給は0以上である必要があります' }
                  })}
                  placeholder="5000"
                />
                {errors.hourlyRate && (
                  <p className="text-sm text-red-500">{errors.hourlyRate.message}</p>
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
                  {loading ? '保存中...' : editingEngineer ? '更新' : '追加'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {engineers.map((engineer) => (
          <Card key={engineer.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <User className="mr-2 h-4 w-4" />
                {engineer.name}
              </CardTitle>
              <div className="flex space-x-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleEdit(engineer)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(engineer)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <p className="text-sm text-muted-foreground">役職</p>
                  <p className="font-medium">{engineer.position}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">時給</p>
                  <p className="font-medium">{formatCurrency(engineer.hourlyRate)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {engineers.length === 0 && (
        <Card>
          <CardContent className="flex items-center justify-center h-32">
            <p className="text-muted-foreground">
              エンジニアが登録されていません
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}