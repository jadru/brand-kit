'use client'

import { MoreHorizontal, Pencil, Trash2, Star } from 'lucide-react'
import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { BrandProfile } from '@/types/database'

interface ProfileCardProps {
  profile: BrandProfile
  onEdit: (profile: BrandProfile) => void
  onDelete: (id: string) => void
}

export function ProfileCard({ profile, onEdit, onDelete }: ProfileCardProps) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <Card className="relative">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className="h-10 w-10 rounded-lg border border-border"
              style={{ backgroundColor: profile.primary_color }}
            />
            <div>
              <p className="font-medium text-text-primary">{profile.name}</p>
              <p className="text-xs text-text-tertiary capitalize">{profile.style_direction}</p>
            </div>
          </div>

          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMenuOpen(!menuOpen)}
              className="h-8 w-8"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
            {menuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 z-20 mt-1 w-36 rounded-md border border-border bg-surface py-1 shadow-md">
                  <button
                    onClick={() => { onEdit(profile); setMenuOpen(false) }}
                    className="flex w-full items-center gap-2 px-3 py-1.5 text-sm text-text-secondary hover:bg-surface-secondary"
                  >
                    <Pencil className="h-3.5 w-3.5" /> Edit
                  </button>
                  <button
                    onClick={() => { onDelete(profile.id); setMenuOpen(false) }}
                    className="flex w-full items-center gap-2 px-3 py-1.5 text-sm text-error hover:bg-surface-secondary"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Delete
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-1.5">
          <Badge variant="secondary">{profile.color_mode}</Badge>
          <Badge variant="secondary">{profile.icon_style}</Badge>
          <Badge variant="secondary">{profile.corner_style}</Badge>
          {profile.is_default && (
            <Badge variant="default">
              <Star className="mr-1 h-3 w-3" /> Default
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
