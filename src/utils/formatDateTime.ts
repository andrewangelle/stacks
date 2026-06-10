import { formatRelative } from 'date-fns';
import { enUS } from 'date-fns/locale';

export function formatActivityTime(createdAt: Date) {
  return formatRelative(new Date(createdAt), new Date(), {
    locale: {
      ...enUS,
      formatRelative: (token) => {
        const formats = {
          lastWeek: "'last' eeee 'at' h:mm a",
          yesterday: "'yesterday'",
          today: "'today at' HH:mm",
          tomorrow: "'tomorrow at' HH:mm",
          nextWeek: "eeee 'at' HH:mm",
          other: 'MMMM dd, yyyy, h:mm a',
        };
        return formats[token];
      },
    },
  });
}
