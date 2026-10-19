import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'

afterEach(() => {
  cleanup()
})

// jsdom no implementa scrollTo; las páginas lo usan al navegar.
window.scrollTo = vi.fn()
