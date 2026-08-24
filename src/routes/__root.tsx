import {
  createRootRouteWithContext,
  HeadContent,
  useRouter,
  Scripts,
} from '@tanstack/react-router'
import { useEffect } from 'react'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtoolsPanel } from '@tanstack/react-query-devtools'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { Toaster } from 'react-hot-toast'

import { AuthContextProvider, useAuth, type AuthContextType } from '#/auth'
import appCss from '#/styles.css?url'
import { Spinner } from '#/components/ui/spinner'

export type MyRouterContext = {
  auth: AuthContextType
}

const queryClient = new QueryClient()

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Sydney Creative Space',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
    scripts: [
      {
        src: 'https://upload-widget.cloudinary.com/latest/global/all.js',
        type: 'text/javascript',
      },
    ],
  }),
  shellComponent: RootDocument,
})

function AuthProviderInnerApp({ children }: { children: React.ReactNode }) {
  const auth = useAuth()
  const router = useRouter()

  useEffect(() => {
    router.update({ context: { ...router.options.context, auth } })
    router.invalidate()
  }, [auth.isAuthenticated, auth.isInitialLoading])

  if (auth.isInitialLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center p-4">
        <Spinner className="size-10" />
      </div>
    )
  }

  return <div>{children}</div>
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <QueryClientProvider client={queryClient}>
          <AuthContextProvider>
            <AuthProviderInnerApp>
              <Toaster />
              {children}
              <TanStackDevtools
                config={{
                  defaultOpen: false,
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
            </AuthProviderInnerApp>
          </AuthContextProvider>
        </QueryClientProvider>
        <Scripts />
      </body>
    </html>
  )
}
