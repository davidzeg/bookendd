import { LogOut } from 'lucide-react'
import { signOut } from '@/app/(auth)/actions'
import { Button } from './ui/button'

export function SignOutButton() {
  return (
    <form action={signOut}>
      <Button variant="outline" size="sm" type="submit">
        <LogOut className="h-4 w-4 mr-2" />
        Sign Out
      </Button>
    </form>
  )
}
