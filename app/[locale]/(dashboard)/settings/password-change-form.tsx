'use client'

import { useState, type FormEvent } from 'react'
import { useTranslations } from 'next-intl'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function PasswordChangeForm() {
  const t = useTranslations('settings.security.changePassword')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (isSaving) return

    setError(null)
    setSuccess(null)

    if (password.length < 6) {
      setError(t('errors.tooShort'))
      return
    }

    if (password !== confirmPassword) {
      setError(t('errors.mismatch'))
      return
    }

    setIsSaving(true)
    try {
      const supabase = createClient()
      const { error: updateError } = await supabase.auth.updateUser({
        password,
      })

      if (updateError) {
        setError(updateError.message || t('errors.unknown'))
        return
      }

      setPassword('')
      setConfirmPassword('')
      setSuccess(t('success'))
    } catch {
      setError(t('errors.unknown'))
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="new-password" required>
          {t('newPasswordLabel')}
        </Label>
        <Input
          id="new-password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder={t('newPasswordPlaceholder')}
          minLength={6}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirm-password" required>
          {t('confirmPasswordLabel')}
        </Label>
        <Input
          id="confirm-password"
          type="password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          placeholder={t('confirmPasswordPlaceholder')}
          minLength={6}
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
