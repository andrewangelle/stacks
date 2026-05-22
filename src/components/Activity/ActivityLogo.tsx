import { ActivityNameCircle } from '~/components/Activity/Activity.styled';
import { useGetProfileQuery } from '~/query/profile';
import { Center } from '~/styles/Page.styled';

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
  const profile = useGetProfileQuery();
  const initials = getInitials(profile.data ?? null);
  return (
    <ActivityNameCircle data-testid="ActivityNameCircle">
      <Center data-testid="Center">
        <div style={{ marginTop: '-2px' }}>{initials}</div>
      </Center>
    </ActivityNameCircle>
  );
}
