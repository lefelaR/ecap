import { Suspense } from 'react';
import { CognitoResetPasswordForm } from '@/components/organisms/CognitoResetPasswordForm';
import { AuthenticationTemplate } from '@/components/templates/AuthenticationTemplate';

export default function ResetPasswordPage() {
  return (
    <AuthenticationTemplate
      title="Reset password"
      lead="Enter the verification code from your email and choose a new password."
    >
      <Suspense fallback={<p className="text-center">Loading…</p>}>
        <CognitoResetPasswordForm />
      </Suspense>
    </AuthenticationTemplate>
  );
}
