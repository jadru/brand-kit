'use client'

import { AlertTriangle, Info, AlertCircle, CheckCircle } from 'lucide-react'
import { Dialog, DialogContent } from './dialog'
import { Button } from './button'
import { cn } from '@/lib/utils/cn'

type DialogVariant = 'danger' | 'warning' | 'info' | 'success'

interface ConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  variant?: DialogVariant
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void | Promise<void>
  isLoading?: boolean
}

const variantConfig = {
  danger: {
    icon: AlertTriangle,
    iconBg: 'bg-error/10',
    iconColor: 'text-error',
    buttonVariant: 'destructive' as const,
  },
  warning: {
    icon: AlertCircle,
    iconBg: 'bg-warning/10',
    iconColor: 'text-warning',
    buttonVariant: 'default' as const,
  },
  info: {
    icon: Info,
    iconBg: 'bg-info/10',
    iconColor: 'text-info',
    buttonVariant: 'default' as const,
  },
  success: {
    icon: CheckCircle,
    iconBg: 'bg-success/10',
    iconColor: 'text-success',
    buttonVariant: 'default' as const,
  },
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  variant = 'danger',
  confirmLabel = '확인',
  cancelLabel = '취소',
  onConfirm,
  isLoading = false,
}: ConfirmDialogProps) {
  const config = variantConfig[variant]
  const Icon = config.icon

  async function handleConfirm() {
    await onConfirm()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        title={title}
        onClose={() => onOpenChange(false)}
        className="max-w-md"
      >
        <div className="flex flex-col items-center text-center sm:flex-row sm:items-start sm:text-left">
          <div
            className={cn(
              'flex h-12 w-12 shrink-0 items-center justify-center rounded-full',
              config.iconBg
            )}
          >
            <Icon className={cn('h-6 w-6', config.iconColor)} aria-hidden="true" />
          </div>
          <div className="mt-4 sm:ml-4 sm:mt-0">
            <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
            <p className="mt-2 text-sm text-text-secondary">{description}</p>
          </div>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            {cancelLabel}
          </Button>
          <Button
            variant={config.buttonVariant}
            onClick={handleConfirm}
            isLoading={isLoading}
          >
            {confirmLabel}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Pre-configured delete confirmation dialog
interface DeleteConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  itemName: string
  itemType?: string
  onConfirm: () => void | Promise<void>
  isLoading?: boolean
}

export function DeleteConfirmDialog({
  open,
  onOpenChange,
  itemName,
  itemType = '항목',
  onConfirm,
  isLoading,
}: DeleteConfirmDialogProps) {
  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title={`${itemType} 삭제`}
      description={`"${itemName}"을(를) 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`}
      variant="danger"
      confirmLabel="삭제"
      onConfirm={onConfirm}
      isLoading={isLoading}
    />
  )
}
