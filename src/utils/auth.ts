import { initializeApp, cert, getApps } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { createServerFn } from '@tanstack/react-start'
import { getSupabaseServerClient } from '~/supabase/config'

export const loginFn = createServerFn({ method: 'POST' })
  .validator((d: { email: string; password: string }) => d)
  .handler(async ({ data }) => {
    const {
      error,
      data: { user },
    } = await getSupabaseServerClient().auth.signInWithPassword({
      email: data.email,
      password: data.password,
    })

    if (error) {
      return {
        error: true,
        message: error?.message,
      }
    }

    if (!user?.id) {
      return { error: true, message: 'No user returned from Supabase' }
    }

    if (!getApps().length) {
      // Do not initialize admin app outside the server function
      initializeApp({
        credential: cert({
          projectId: process.env.VITE_PUBLIC_FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY,
        }),
      })
    }

    // creating firebase jwt token with user.id from supabase
    // it's meant to be used on client side, not here
    const token = await getAuth().createCustomToken(user.id)

    return { error: false, token, userId: user.id }
  })
