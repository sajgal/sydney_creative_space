import { Link, useMatchRoute } from '@tanstack/react-router'
import { cn } from '@/lib/utils'
import {
  NavigationMenu,
  NavigationMenuItem,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
import { useAuth } from '#/auth'
import { FingerprintPattern, ShieldKeyhole } from 'lucide-react'

interface NavItem {
  to: string
  label: string
  exact?: boolean
}

interface MainNavProps {
  items: NavItem[]
  className?: string
  isAdmin?: boolean
}

export function MainNav({ items, className, isAdmin }: MainNavProps) {
  const matchRoute = useMatchRoute()
  const { isAuthenticated, isSuperAdmin } = useAuth()

  return (
    <NavigationMenu className={className}>
      <div className="flex list-none flex-wrap justify-center">
        {isSuperAdmin && isAdmin && (
          <NavigationMenuItem key="management">
            <Link
              to="/management"
              className={cn(
                navigationMenuTriggerStyle(),
                matchRoute({ to: '/management' }) &&
                  'bg-accent text-accent-foreground font-medium',
              )}
            >
              <FingerprintPattern />
            </Link>
          </NavigationMenuItem>
        )}

        {items.map((item) => {
          const isActive = matchRoute({ to: item.to, fuzzy: !item.exact })

          return (
            <NavigationMenuItem key={item.to}>
              <Link
                to={item.to}
                className={cn(
                  navigationMenuTriggerStyle(),
                  isActive && 'bg-accent text-accent-foreground font-medium',
                )}
              >
                {item.label}
              </Link>
            </NavigationMenuItem>
          )
        })}

        {!!isAuthenticated && !isAdmin && (
          <NavigationMenuItem key="admin">
            <Link
              to="/admin"
              className={cn(
                navigationMenuTriggerStyle(),
                matchRoute({ to: '/admin' }) &&
                  'bg-accent text-accent-foreground font-medium',
              )}
            >
              <ShieldKeyhole />
            </Link>
          </NavigationMenuItem>
        )}
      </div>
    </NavigationMenu>
  )
}
