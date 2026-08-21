import { useForm } from '@tanstack/react-form'
import { useLocation, useNavigate } from '@tanstack/react-router'
import { signInWithCustomToken } from 'firebase/auth'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { auth } from '~/firebase/config'
import { loginFn } from '~/utils/auth'

export function Login() {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const {
    search: { redirect },
  } = useLocation()

  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    onSubmit: async ({ value }) => {
      const showError = (message: string) => {
        toast.error(message, { duration: 10000 })
        setIsSubmitting(false)
      }

      setIsSubmitting(true)
      const loginResponse = await loginFn({ data: value })

      if (loginResponse.error) {
        return showError(loginResponse.message)
      }

      try {
        await signInWithCustomToken(auth, loginResponse.token)
      } catch (error) {
        console.error('Firebase login error', error)
        return showError((error as Error).message)
      }

      toast.success('Successfully logged in!')
      navigate({ to: redirect || '/dashboard' })
    },
  })

  return (
    <div className="bg-amber-50 p-2 text-black">
      <form
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
      >
        {isSubmitting && <div>Loader or something</div>}

        <form.Field
          name="email"
          validators={{
            onChange: ({ value }) =>
              !value.includes('@') ? 'Invalid email' : undefined,
          }}
          children={(field) => (
            <>
              <input
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                type="email"
                placeholder="your email"
                onChange={(e) => field.handleChange(e.target.value)}
              />
              {!field.state.meta.isValid && (
                <em>{field.state.meta.errors.join(',')}</em>
              )}
            </>
          )}
        />
        <br />
        <form.Field
          name="password"
          children={(field) => (
            <>
              <input
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                type="password"
                placeholder="password"
                onChange={(e) => field.handleChange(e.target.value)}
              />
              {!field.state.meta.isValid && (
                <em>{field.state.meta.errors.join(',')}</em>
              )}
            </>
          )}
        />
        <br />
        <form.Subscribe
          selector={({ canSubmit }) => canSubmit}
          children={(canSubmit) => (
            <button type="submit" disabled={!canSubmit}>
              Submit
            </button>
          )}
        />
      </form>
    </div>
  )
}
