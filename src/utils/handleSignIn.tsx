import { GithubAuthProvider, type AuthProvider } from 'firebase/auth'
import type { AnyRouter } from '@tanstack/react-router'

export const handleSignInUtil = async (router: AnyRouter, login: (provider: AuthProvider) => Promise<void>, provider: 'github') => {
    try {
      const providers = {
        github: new GithubAuthProvider(),
        // Other providers can be allocated here
      }

      const typedProvider =
        providers[provider] ??
        (() => {
          throw new Error('Invalid provider')
        })()

      await login(typedProvider)
      router.invalidate() // This forces the user to route to /dashboard
    } catch (error) {
      console.error('Sign in error:', error)
    }
  }