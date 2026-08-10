import { createFileRoute, redirect } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import { useAuth } from '../auth';
import { db } from '../firebase/config';
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useQuery } from '@tanstack/react-query';
import { Spinner } from '@/components/ui/spinner';

export const Route = createFileRoute('/settings')({
  beforeLoad: ({ context, location }) => {
    // Check if user is authenticated
    if (!context.auth.isAuthenticated) {
      console.log('User not authenticated, redirecting to login...')
      throw redirect({
        to: '/',
        search: {
          redirect: location.href,
        },
      })
    }
    console.log('User authenticated, proceeding...')
  },
  component: SettingsComponent,
})

function SettingsComponent() {
  const { user } = useAuth();
  const userId = user?.uid ?? "-";
  const firestoreDoc = doc(db, 'settings', userId);

  const { data, isLoading } = useQuery({
    queryKey: ['data'],
    queryFn: async () => {
      const settingData = await getDoc(firestoreDoc);
      console.log('🌺🌺 settingData', settingData.data());

      return settingData.data()?.value ?? "";
    }
  });

  const form = useForm({
    defaultValues: {
      setting1: data ?? '',
    },
    onSubmit: async ({ value }) => {
      console.log('🌺🌺 form values', value, user);
      await setDoc(firestoreDoc, {
        value: value.setting1,
      });
      console.log('🌺🌺 form values saved');
    }
  })

  if (isLoading) return (
    <div className="flex h-screen w-full items-center justify-center p-4">
      <Spinner className='size-10' />
    </div>
  );

  return <div>
    <a href='/'><h1>Settings</h1></a>
    <div>Loading: {isLoading ? "Loading" : "Not Loading"}</div>
    <form
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
      }}
      className="flex flex-col w-md mx-auto"
    >
      <form.Field
        name='setting1'
        children={(field) => (
          <>
            <input
              name={field.name}
              type='text'
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              className="border-2 border-amber-600"
            />
          </>
        )}
      />
      <button
        type="submit"
        onClick={form.handleSubmit}
      >
        Submit
      </button>
    </form>
  </div>
}
