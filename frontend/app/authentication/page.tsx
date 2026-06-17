import { redirect } from 'next/navigation';

export default function AuthenticationIndexPage() {
  redirect('/authentication/login');
}
