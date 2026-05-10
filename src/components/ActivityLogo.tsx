import { useSessionUserId } from '~/hooks/useSessionUserId';
import { useGetProfileQuery } from '~/store/profileApi';
import { ActivityNameCircle } from '~/styles/Activity';
import { Center } from '~/styles/Page';

export function getInitials(
  data: { firstName: string; lastName: string } | null,
) {
  if (data === null || !data.firstName) {
    return 'Anon';
  }

  const { firstName, lastName } = data;
  const firstInitial = firstName.charAt(0).toUpperCase();
  const lastInitial = lastName.charAt(0).toUpperCase();

  return `${firstInitial}${lastInitial}`;
}

export function ActivityLogo() {
  const userId = useSessionUserId();
  const profile = useGetProfileQuery(
    { userId: userId ?? '' },
    { skip: !userId },
  );
  const initials = getInitials(profile.data ?? null);
  return (
    <ActivityNameCircle>
      <Center>
        <div style={{ marginTop: '-2px' }}>{initials}</div>
      </Center>
    </ActivityNameCircle>
  );
}
