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
import { Plus, TrendingUp, TrendingDown, Edit, Trash2 } from 'lucide-react'
import { Transaction, CreateTransactionFormData } from '@/types'
import { formatCurrency, formatDate } from '@/lib/utils'
import { transactionApi } from '@/lib/api'

interface TransactionManagerProps {
  projectId: string
  onTransactionChanged: () => void
}

export function TransactionManager({ projectId, onTransactionChanged }: TransactionManagerProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [open, setOpen] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)
  const [loading, setLoading] = useState(false)
  
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateTransactionFormData>()

  const selectedType = watch('type')

  useEffect(() => {
    if (projectId) {
      loadTransactions()
    }
  }, [projectId])

  useEffect(() => {
    if (editingTransaction) {
      setValue('type', editingTransaction.type)
      setValue('amount', editingTransaction.amount)
      setValue('category', editingTransaction.category)
      setValue('date', editingTransaction.date.split('T')[0])
      setValue('description', editingTransaction.description)
      setOpen(true)
    }
  }, [editingTransaction, setValue])

  const loadTransactions = async () => {
    try {
      const data = await transactionApi.getAll(projectId)
      setTransactions(data)
    } catch (error) {
      console.error('Failed to load transactions:', error)
    }
  }

  const onSubmit = async (data: CreateTransactionFormData) => {
    setLoading(true)
    try {
      const transactionData = {
        ...data,
        projectId,
      }

      if (editingTransaction) {
        await transactionApi.update(editingTransaction.id, transactionData)
      } else {
        await transactionApi.create(transactionData)
      }
      
      reset()
      setOpen(false)
      setEditingTransaction(null)
      loadTransactions()
      onTransactionChanged()
    } catch (error) {
      console.error('Failed to save transaction:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction)
  }

  const handleDelete = async (transaction: Transaction) => {
    if (confirm('この取引を削除しますか？')) {
      try {
        await transactionApi.delete(transaction.id)
        loadTransactions()
        onTransactionChanged()
      } catch (error) {
        console.error('Failed to delete transaction:', error)
      }
    }
  }

  const handleDialogClose = () => {
    setOpen(false)
    setEditingTransaction(null)
    reset()
  }

  const getTypeLabel = (type: string) => {
    return type === 'INCOME' ? '収入' : '支出'
  }

  const getTypeIcon = (type: string) => {
    return type === 'INCOME' ? (
      <TrendingUp className="h-4 w-4 text-green-600" />
    ) : (
      <TrendingDown className="h-4 w-4 text-red-600" />
    )
  }

  const getTypeColor = (type: string) => {
    return type === 'INCOME' ? 'text-green-600' : 'text-red-600'
  }

  const totalIncome = transactions
    .filter(t => t.type === 'INCOME')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalExpense = transactions
    .filter(t => t.type === 'EXPENSE')
    .reduce((sum, t) => sum + t.amount, 0)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">取引履歴</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              取引追加
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {editingTransaction ? '取引編集' : '新規取引追加'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="type">種別</Label>
                <Select
                  value={selectedType}
                  onValueChange={(value) => setValue('type', value as 'INCOME' | 'EXPENSE')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="種別を選択" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="INCOME">収入</SelectItem>
                    <SelectItem value="EXPENSE">支出</SelectItem>
                  </SelectContent>
                </Select>
                {errors.type && (
                  <p className="text-sm text-red-500">{errors.type.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">金額</Label>
                <Input
                  id="amount"
                  type="number"
                  {...register('amount', { 
                    required: '金額は必須です',
                    min: { value: 0, message: '金額は0以上である必要があります' }
                  })}
                  placeholder="100000"
                />
                {errors.amount && (
                  <p className="text-sm text-red-500">{errors.amount.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">カテゴリ</Label>
                <Input
                  id="category"
                  {...register('category', { required: 'カテゴリは必須です' })}
                  placeholder="契約金、ツール費用など"
                />
                {errors.category && (
                  <p className="text-sm text-red-500">{errors.category.message}</p>
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
                <Label htmlFor="description">説明</Label>
                <Input
                  id="description"
                  {...register('description', { required: '説明は必須です' })}
                  placeholder="詳細な説明"
                />
                {errors.description && (
                  <p className="text-sm text-red-500">{errors.description.message}</p>
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
                  {loading ? '保存中...' : editingTransaction ? '更新' : '追加'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">総収入</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(totalIncome)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">総支出</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(totalExpense)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">差引</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${
              totalIncome - totalExpense >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {formatCurrency(totalIncome - totalExpense)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transactions Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b">
                <tr>
                  <th className="text-left p-4">日付</th>
                  <th className="text-left p-4">種別</th>
                  <th className="text-left p-4">金額</th>
                  <th className="text-left p-4">カテゴリ</th>
                  <th className="text-left p-4">説明</th>
                  <th className="text-right p-4">操作</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction.id} className="border-b">
                    <td className="p-4">{formatDate(transaction.date)}</td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        {getTypeIcon(transaction.type)}
                        <span className={getTypeColor(transaction.type)}>
                          {getTypeLabel(transaction.type)}
                        </span>
                      </div>
                    </td>
                    <td className={`p-4 font-medium ${getTypeColor(transaction.type)}`}>
                      {transaction.type === 'INCOME' ? '+' : '-'}
                      {formatCurrency(transaction.amount)}
                    </td>
                    <td className="p-4">{transaction.category}</td>
                    <td className="p-4">{transaction.description}</td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end space-x-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(transaction)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(transaction)}
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
          {transactions.length === 0 && (
            <div className="flex items-center justify-center h-32">
              <p className="text-muted-foreground">
                取引データがありません
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}