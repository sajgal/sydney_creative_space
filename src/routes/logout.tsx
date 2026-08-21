import { redirect, createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { getSupabaseServerClient } from '../supabase/config'
import { signOut } from 'firebase/auth'
import { auth } from '~/firebase/config'

const logoutFn = createServerFn().handler(async () => {
  const supabase = getSupabaseServerClient()
  const { error } = await supabase.auth.signOut()
  await signOut(auth);

  if (error) {
    return {
      error: true,
      message: error.message,
    }
  }

  throw redirect({
    href: '/',
  })
})

export const Route = createFileRoute('/logout')({
  preload: false,
  loader: () => logoutFn(),
})
