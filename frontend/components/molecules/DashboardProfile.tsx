import Link from 'next/link';
import type { SessionUser } from '@/lib/types';
import { PROFILE_PATH } from '@/lib/post-login-redirect';
import { UserAvatar } from '@/components/atoms/UserAvatar';

interface DashboardProfileProps {
  session: SessionUser;
}

export function DashboardProfile({ session }: DashboardProfileProps) {
  return (
    <Link href={PROFILE_PATH} className="dashboard-profile dashboard-profile--link">
      <UserAvatar
        name={session.name}
        imageUrl={session.imageUrl}
        className="dashboard-profile__avatar"
      />
      <p className="dashboard-profile__name">{session.name}</p>
      <p className="dashboard-profile__meta">
        {session.authSource === 'cognito' ? 'Citizen account' : session.type}
        {session.ward && session.ward !== 'All' ? ` · ${session.ward}` : ''}
      </p>
    </Link>
  );
}
