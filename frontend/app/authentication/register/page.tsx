import { CognitoRegisterForm } from '../../../components/organisms/CognitoRegisterForm';
import { AuthenticationTemplate } from '../../../components/templates/AuthenticationTemplate';

export default function RegisterPage() {
  return (
    <AuthenticationTemplate
      title="Create an account"
      lead="Register a new ECAP account with AWS Cognito. You will receive a verification email."
    >
      <CognitoRegisterForm />
    </AuthenticationTemplate>
  );
}
