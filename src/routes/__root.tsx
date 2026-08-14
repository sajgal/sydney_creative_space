import { TanStackDevtools } from '@tanstack/react-devtools'
import { ReactQueryDevtoolsPanel } from '@tanstack/react-query-devtools'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'

import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import type { AuthContextType } from '../auth'
import { ThemeProvider } from '@/components/theme-provider'

export type MyRouterContext = {
  auth: AuthContextType
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => (
    <>
      <ThemeProvider defaultTheme="system" storageKey="theme">
        <Outlet />
        <TanStackDevtools
          config={{
            defaultOpen: false,
            // hideUntilHover: true,
          }}
          plugins={[
            {
              name: 'TanStack Query',
              render: <ReactQueryDevtoolsPanel />,
            },
            {
              name: 'TanStack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
      </ThemeProvider>
    </>
  ),
})
