import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, beforeEach, vi } from 'vitest'

// @ts-expect-error
global.IS_REACT_ACT_ENVIRONMENT = true
window.scrollTo = vi.fn()

beforeEach(() => vi.clearAllMocks())
afterEach(() => {
  vi.clearAllMocks()
  vi.resetAllMocks()
  cleanup()
})
