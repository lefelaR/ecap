import type { SessionUser } from '@/lib/types';
import { UserAvatar } from '@/components/atoms/UserAvatar';

interface DashboardProfileProps {
  session: SessionUser;
}

export function DashboardProfile({ session }: DashboardProfileProps) {
  return (
    <div className="dashboard-profile">
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
    </div>
  );
}
