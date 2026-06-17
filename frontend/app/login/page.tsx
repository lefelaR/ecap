import { redirect } from 'next/navigation';

export default function LoginRedirectPage({
  searchParams,
}: {
  searchParams: { redirect?: string };
}) {
  const query = searchParams.redirect ? `?redirect=${encodeURIComponent(searchParams.redirect)}` : '';
  redirect(`/authentication/login${query}`);
}
