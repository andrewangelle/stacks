import { formatRelative } from 'date-fns';
import { enUS } from 'date-fns/locale';

export function formatActivityTime(createdAt: Date) {
  return formatRelative(new Date(createdAt), new Date(), {
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
