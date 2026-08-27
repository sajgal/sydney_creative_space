import { createServerFn } from '@tanstack/react-start'

export const getServerTime = createServerFn().handler(async () => {
  return Date.now()
})
