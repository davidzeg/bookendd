'use client'

import { Loader2 } from 'lucide-react'
import type { ComponentProps } from 'react'
import { useFormStatus } from 'react-dom'
import { Button } from '@/components/ui/button'

type ButtonProps = ComponentProps<typeof Button>

interface SubmitButtonProps extends ButtonProps {
  children: React.ReactNode
  pendingText?: string
}

export function SubmitButton({ children, pendingText, disabled, ...props }: SubmitButtonProps) {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" disabled={pending || disabled} {...props}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {pendingText || 'Loading...'}
        </>
      ) : (
        children
      )}
    </Button>
  )
}
