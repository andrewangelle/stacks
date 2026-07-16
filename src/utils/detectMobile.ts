import { createServerFn } from '@tanstack/react-start';
import { getRequest } from '@tanstack/react-start/server';

export const detectMobile = createServerFn({ method: 'GET' }).handler(
  async () => {
    const request = getRequest();
    const ua = request?.headers.get('user-agent') ?? '';

    // simple regex check — swap for a library like ua-parser-js if you want more accuracy
    const isMobile = /Android|iPhone|iPad|iPod|Mobile|Windows Phone/i.test(ua);

    return { isMobile };
  },
);
