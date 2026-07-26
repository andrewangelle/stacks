import { useUser } from '@clerk/tanstack-react-start';
import * as activityStyles from '~/components/Activity/Activity.css';
import * as pageStyles from '~/styles/Page.css';

export function useInitials() {
  const { user } = useUser();

  if (!user?.firstName) {
    return 'U';
  }

  const { firstName, lastName } = user;
  const firstInitial = firstName.charAt(0).toUpperCase();
  const lastInitial = lastName?.charAt(0).toUpperCase() ?? '';

  return `${firstInitial}${lastInitial}`;
}

export function ActivityLogo() {
  const initials = useInitials();
  return (
    <div
      className={activityStyles.activityNameCircle}
      data-testid="ActivityNameCircle"
    >
      <div className={pageStyles.center} data-testid="Center">
        <div style={{ marginTop: '-2px' }}>{initials}</div>
      </div>
    </div>
  );
}
