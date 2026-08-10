import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import type { AuthContextType } from '../auth'
import { ThemeProvider } from "@/components/theme-provider"

export type MyRouterContext = {
  auth: AuthContextType
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => (
    <>
      <ThemeProvider defaultTheme="system" storageKey="theme">
        <Outlet />
      </ThemeProvider>
      <TanStackRouterDevtools position="bottom-right" initialIsOpen={false} />
    </>
  ),
})