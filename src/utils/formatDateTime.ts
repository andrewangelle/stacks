import { differenceInMinutes, formatRelative } from 'date-fns';
import { enUS } from 'date-fns/locale';

export function formatActivityTime(createdAt: Date) {
  const date = new Date(createdAt);
  const now = new Date();
  const minutesAgo = differenceInMinutes(now, date);

  if (minutesAgo >= 0 && minutesAgo < 2) {
    return 'just now';
  }

  if (minutesAgo >= 2 && minutesAgo < 60) {
    return `${minutesAgo} minutes ago`;
  }

  if (minutesAgo >= 60 && minutesAgo < 120) {
    return '1 hour ago';
  }

  return formatRelative(date, now, {
    locale: {
      ...enUS,
      formatRelative: (token) => {
        const formats = {
          lastWeek: "'last' eeee 'at' h:mm a",
          yesterday: "'yesterday' 'at' h:mm a",
          today: "'today at' h:mm a",
          tomorrow: "'tomorrow at' h:mm a",
          nextWeek: "eeee 'at' h:mm a",
          other: 'MMMM dd, yyyy, h:mm a',
        };
        return formats[token];
      },
    },
  });
}
