import {
  AuthCredential,
  EmailAuthProvider,
  GithubAuthProvider,
  type AuthProvider,
} from 'firebase/auth'
import type { AnyRouter } from '@tanstack/react-router'

export const handleSignInUtil = async (
  router: AnyRouter,
  login: (
    provider: AuthProvider,
    credentials?: AuthCredential,
  ) => Promise<void>,
  provider: 'github' | 'email',
  credentials?: AuthCredential,
) => {
  try {
    const providers = {
      github: new GithubAuthProvider(),
      email: new EmailAuthProvider(),
    }

    const typedProvider =
      providers[provider] ??
      (() => {
        throw new Error('Invalid provider')
      })()

    await login(typedProvider, credentials)
    router.invalidate() // This forces the user to route to /dashboard or ?redirect
  } catch (error) {
    return { error }
  }
}
