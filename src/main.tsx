import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { routeTree } from './routeTree.gen'
import { AuthContextProvider, useAuth } from './auth'
import { TooltipProvider } from "@/components/ui/tooltip"

import './styles.css'
import { Spinner } from '@/components/ui/spinner'

// Set up a Router instance
const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  scrollRestoration: true,
  context: {
    auth: undefined!, // This will be set after we wrap the app in AuthContextProvider
  },
})

const queryClient = new QueryClient();

// Register things for typesafety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

function InnerApp() {
  const auth = useAuth()

  // If the provider is initially loading, do not render the router
  if (auth.isInitialLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center p-4">
        {/* <div className="size-10 rounded-full border-4 border-gray-200 border-t-foreground animate-spin" /> */}
        <Spinner className='size-10' />
      </div>
    )
  }

  return <RouterProvider router={router} context={{ auth }} />
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthContextProvider>
        <TooltipProvider>
          <InnerApp />
        </TooltipProvider>
      </AuthContextProvider>
    </QueryClientProvider>
  )
}

const rootElement = document.getElementById('app')!

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
}
