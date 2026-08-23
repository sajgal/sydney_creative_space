import { siGithub } from 'simple-icons'
import { useRouter } from '@tanstack/react-router'

import { handleSignInUtil } from '@/utils/handleSignIn'
import { useAuth } from '@/auth';

export function GithubLogin() {
  const router = useRouter();
  const { login } = useAuth();

  return (
    <div className="w-full max-w-md px-4 animate-fade-up relative z-10">
      <div className="w-full backdrop-blur-xs bg-card/80 p-8 space-y-8 shadow-md border border-border">
        <div className="space-y-4">
          {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
          <button
            className="w-full h-12 font-medium bg-background hover:bg-secondary border-2 transition-all hover:scale-[1.02]"
            onClick={() => handleSignInUtil(router, login, 'github')}
          >
            <div className="flex items-center justify-center w-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="mr-2 h-5 w-5"
                fill="currentColor"
                aria-labelledby="githubIconTitle"
                role="img"
                style={{ minWidth: '20px' }}
              >
                <title id="githubIconTitle">GitHub Logo</title>
                <path d={siGithub.path} />
              </svg>
              <span>Continue with GitHub</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}