import { CognitoForgotPasswordForm } from '../../../components/organisms/CognitoForgotPasswordForm';
import { AuthenticationTemplate } from '../../../components/templates/AuthenticationTemplate';

export default function ForgotPasswordPage() {
  return (
    <AuthenticationTemplate
      title="Forgot password"
      lead="Enter your email address and we will send you a verification code to reset your password."
    >
      <CognitoForgotPasswordForm />
    </AuthenticationTemplate>
  );
}
