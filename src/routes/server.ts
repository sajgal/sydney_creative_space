// routes/server.ts
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/server')({
  server: {
    handlers: {
      GET: async () => {
        return new Response('Hello, World!')
      },
    },
  },
})