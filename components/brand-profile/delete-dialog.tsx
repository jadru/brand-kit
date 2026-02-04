'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent } from '@/components/ui/dialog'

interface DeleteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  profileName: string
  onConfirm: () => Promise<void>
}

export function DeleteDialog({ open, onOpenChange, profileName, onConfirm }: DeleteDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  async function handleDelete() {
    setIsDeleting(true)
    await onConfirm()
    setIsDeleting(false)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        title="Delete Brand Profile"
        description={`Are you sure you want to delete "${profileName}"? This action cannot be undone.`}
        onClose={() => onOpenChange(false)}
      >
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isDeleting}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete} isLoading={isDeleting}>
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
