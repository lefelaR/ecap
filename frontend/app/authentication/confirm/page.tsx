import { Suspense } from 'react';
import { CognitoConfirmForm } from '../../../components/organisms/CognitoConfirmForm';
import { AuthenticationTemplate } from '../../../components/templates/AuthenticationTemplate';

export default function ConfirmPage() {
  return (
    <AuthenticationTemplate
      title="Confirm your account"
      lead="Enter the verification code from your email to activate your ECAP account."
    >
      <Suspense fallback={<p className="text-center">Loading…</p>}>
        <CognitoConfirmForm />
      </Suspense>
    </AuthenticationTemplate>
  );
}
