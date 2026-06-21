import { Suspense } from 'react';
import { CognitoLoginForm } from '@/components/organisms/CognitoLoginForm';
import { AuthenticationTemplate } from '@/components/templates/AuthenticationTemplate';

export default function LoginPage() {
  return (
    <AuthenticationTemplate
      title="Sign in to ECAP"
      lead="Sign in to access your ECAP system dashboard, reporting tools, and authority features."
    >
      <Suspense fallback={<p className="text-center">Loading…</p>}>
        <CognitoLoginForm />
      </Suspense>
    </AuthenticationTemplate>
  );
}
