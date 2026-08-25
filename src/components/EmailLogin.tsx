import { useForm } from '@tanstack/react-form'
import * as z from 'zod'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { useRouter } from '@tanstack/react-router'
import { useAuth } from '#/auth'
import { EmailAuthProvider } from 'firebase/auth'
import { handleSignInUtil } from '#/utils/handleSignIn'
import toast from 'react-hot-toast'
import { Spinner } from './ui/spinner'

const formSchema = z.object({
  email: z.email(),
  password: z.string().min(1, "Password can't be empty"),
})

export function EmailLogin() {
  const router = useRouter()
  const { login } = useAuth()

  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      const credentials = EmailAuthProvider.credential(
        value.email,
        value.password,
      )

      const signInResponse = await handleSignInUtil(
        router,
        login,
        'email',
        credentials,
      )

      if (signInResponse && signInResponse.error) {
        toast.error('Invalid credentials', { duration: 10000 })
      }
    },
  })

  return (
    <Card className="w-full sm:max-w-md">
      <CardHeader>
        <CardTitle>Login</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          id="bug-report-form"
          onSubmit={(e) => {
            e.preventDefault()
            form.handleSubmit()
          }}
        >
          <FieldGroup>
            <form.Field
              name="email"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="name@email.com.au"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                )
              }}
            />
            <form.Field
              name="password"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="&#9679;&#9679;&#9679;&#9679;&#9679;"
                      autoComplete="off"
                      type="password"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                )
              }}
            />
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <form.Subscribe
          selector={({ canSubmit, isSubmitting }) => [canSubmit, isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <Field orientation="horizontal" className="flex justify-end">
              {!isSubmitting && (
                <Button
                  type="submit"
                  form="bug-report-form"
                  disabled={!canSubmit}
                >
                  Submit
                </Button>
              )}

              {!!isSubmitting && (
                <Button disabled>
                  <Spinner data-icon="inline-start" />
                  Submitting...
                </Button>
              )}
            </Field>
          )}
        />
      </CardFooter>
    </Card>
  )
}
