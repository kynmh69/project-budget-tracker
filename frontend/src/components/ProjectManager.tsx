import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus } from 'lucide-react'
import { CreateProjectFormData } from '@/types'
import { projectApi } from '@/lib/api'

interface ProjectManagerProps {
  onProjectCreated: () => void
}

export function ProjectManager({ onProjectCreated }: ProjectManagerProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateProjectFormData>()

  const onSubmit = async (data: CreateProjectFormData) => {
    setLoading(true)
    try {
      await projectApi.create({
        name: data.name,
        budget: data.budget,
        startDate: data.startDate,
        endDate: data.endDate || undefined,
      })
      
      reset()
      setOpen(false)
      onProjectCreated()
    } catch (error) {
      console.error('Failed to create project:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          新規プロジェクト
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>新規プロジェクト作成</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">プロジェクト名</Label>
            <Input
              id="name"
              {...register('name', { required: 'プロジェクト名は必須です' })}
              placeholder="プロジェクト名を入力"
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="budget">予算</Label>
            <Input
              id="budget"
              type="number"
              {...register('budget', { 
                required: '予算は必須です',
                min: { value: 0, message: '予算は0以上である必要があります' }
              })}
              placeholder="1000000"
            />
            {errors.budget && (
              <p className="text-sm text-red-500">{errors.budget.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="startDate">開始日</Label>
            <Input
              id="startDate"
              type="date"
              {...register('startDate', { required: '開始日は必須です' })}
            />
            {errors.startDate && (
              <p className="text-sm text-red-500">{errors.startDate.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="endDate">終了日（任意）</Label>
            <Input
              id="endDate"
              type="date"
              {...register('endDate')}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              キャンセル
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? '作成中...' : '作成'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}