import { Link, useMatchRoute } from '@tanstack/react-router'
import { cn } from '@/lib/utils'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
import { useAuth } from '#/auth'
import { ShieldKeyhole } from 'lucide-react'

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
  const { isAuthenticated } = useAuth()

  return (
    <NavigationMenu className={className}>
      <NavigationMenuList>
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
      </NavigationMenuList>
    </NavigationMenu>
  )
}
