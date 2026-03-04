'use client'

import { useState, type FormEvent } from 'react'
import { useTranslations } from 'next-intl'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface EmailChangeFormProps {
  currentEmail: string
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function EmailChangeForm({ currentEmail }: EmailChangeFormProps) {
  const t = useTranslations('settings.security.changeEmail')
  const [email, setEmail] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (isSaving) return

    const nextEmail = email.trim()
    setError(null)
    setSuccess(null)

    if (!EMAIL_REGEX.test(nextEmail)) {
      setError(t('errors.invalidEmail'))
      return
    }

    if (nextEmail.toLowerCase() === currentEmail.toLowerCase()) {
      setError(t('errors.sameAsCurrent'))
      return
    }

    setIsSaving(true)
    try {
      const supabase = createClient()
      const { error: updateError } = await supabase.auth.updateUser({ email: nextEmail })

      if (updateError) {
        setError(updateError.message || t('errors.unknown'))
        return
      }

      setEmail('')
      setSuccess(t('success', { email: nextEmail }))
    } catch {
      setError(t('errors.unknown'))
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="new-email" required>
          {t('newEmailLabel')}
        </Label>
        <Input
          id="new-email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder={t('newEmailPlaceholder')}
          autoComplete="email"
          required
        />
      </div>

      {error && (
        <p className="text-sm text-status-error" role="alert" aria-live="polite">
          {error}
        </p>
      )}
      {success && (
        <p className="text-sm text-success" role="status" aria-live="polite">
          {success}
        </p>
      )}

      <Button type="submit" size="sm" isLoading={isSaving}>
        {isSaving ? t('saving') : t('submit')}
      </Button>
    </form>
  )
}
