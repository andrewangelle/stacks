import { useUser } from '@clerk/tanstack-react-start';
import { ActivityNameCircle } from '~/components/Activity/Activity.styled';
import { Center } from '~/styles/Page.styled';

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
    <ActivityNameCircle data-testid="ActivityNameCircle">
      <Center data-testid="Center">
        <div style={{ marginTop: '-2px' }}>{initials}</div>
      </Center>
    </ActivityNameCircle>
  );
}
