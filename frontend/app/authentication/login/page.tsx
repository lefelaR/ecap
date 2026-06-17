import { Suspense } from 'react';
import { CognitoLoginForm } from '../../../components/organisms/CognitoLoginForm';
import { AuthenticationTemplate } from '../../../components/templates/AuthenticationTemplate';

export default function LoginPage() {
  return (
    <AuthenticationTemplate
      title="Sign in to ECAP"
      lead="Sign in with your AWS Cognito account to access authority and admin features."
    >
      <Suspense fallback={<p className="text-center">Loading…</p>}>
        <CognitoLoginForm />
      </Suspense>
    </AuthenticationTemplate>
  );
}
