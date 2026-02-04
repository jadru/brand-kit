'use client'

import { useEffect, useRef, useCallback } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface DialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
}

function Dialog({ open, onOpenChange, children }: DialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (open) {
      dialog.showModal()
    } else {
      dialog.close()
    }
  }, [open])

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent<HTMLDialogElement>) => {
      if (e.target === e.currentTarget) {
        onOpenChange(false)
      }
    },
    [onOpenChange]
  )

  const handleCancel = useCallback(
    (e: React.SyntheticEvent<HTMLDialogElement>) => {
      e.preventDefault()
      onOpenChange(false)
    },
    [onOpenChange]
  )

  return (
    <dialog
      ref={dialogRef}
      className="fixed inset-0 z-50 m-auto max-h-[85vh] w-full max-w-lg rounded-2xl border border-border bg-surface p-0 shadow-xl backdrop:bg-black/60 backdrop:backdrop-blur-sm"
      onClick={handleBackdropClick}
      onCancel={handleCancel}
    >
      {open && children}
    </dialog>
  )
}

interface DialogContentProps {
  title: string
  description?: string
  children: React.ReactNode
  className?: string
  onClose?: () => void
}

function DialogContent({ title, description, children, className, onClose }: DialogContentProps) {
  return (
    <div className={cn('p-6', className)}>
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h2 className="font-display text-lg font-semibold text-text-primary">{title}</h2>
          {description && (
            <p className="mt-1 text-sm text-text-secondary">{description}</p>
          )}
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="rounded-md p-1 text-text-tertiary hover:bg-surface-secondary hover:text-text-primary"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      {children}
    </div>
  )
}

export { Dialog, DialogContent }
