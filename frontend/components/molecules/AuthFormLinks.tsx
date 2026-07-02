import Link from 'next/link';

interface AuthFormLinksProps {
  mode: 'login' | 'register' | 'confirm' | 'forgot-password' | 'reset-password';
}

export function AuthFormLinks({ mode }: AuthFormLinksProps) {
  return (
    <div className="text-center small mt-4">
      {mode === 'login' && (
        <>
          <p className="mb-1">
            <Link href="/authentication/forgot-password">Forgot your password?</Link>
          </p>
          <p className="mb-0">
            Don&apos;t have an account? <Link href="/authentication/register">Register</Link>
          </p>
          <p className="mb-0 mt-1">
            Need to verify your email? <Link href="/authentication/confirm">Confirm account</Link>
          </p>
        </>
      )}
      {mode === 'register' && (
        <p className="mb-0">
          Already have an account? <Link href="/authentication/login">Sign in</Link>
        </p>
      )}
      {mode === 'confirm' && (
        <>
          <p className="mb-1">
            Already confirmed? <Link href="/authentication/login">Sign in</Link>
          </p>
          <p className="mb-0">
            Need an account? <Link href="/authentication/register">Register</Link>
          </p>
        </>
      )}
      {mode === 'forgot-password' && (
        <>
          <p className="mb-1">
            Remember your password? <Link href="/authentication/login">Sign in</Link>
          </p>
          <p className="mb-0">
            Have a reset code? <Link href="/authentication/reset-password">Reset password</Link>
          </p>
        </>
      )}
      {mode === 'reset-password' && (
        <p className="mb-0">
          Need a new code? <Link href="/authentication/forgot-password">Request one</Link>
        </p>
      )}
    </div>
  );
}
