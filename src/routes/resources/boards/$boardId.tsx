import { createFileRoute } from '@tanstack/react-router';
import { jsonResponse } from '~/modules/response';
import client from '~/modules/supabase';

export const loader = async ({
  params,
}: {
  params: Record<string, string>;
}) => {
  const rows = await client().from('stacks').select();

  if (rows.data !== null) {
    const board = rows.data.find((value) => `${value.id}` === params.boardId);
    return jsonResponse(board);
  }

  return jsonResponse({});
};

export const Route = createFileRoute('/resources/boards/$boardId')({
  server: {
    handlers: {
      GET: ({ params }) => loader({ params }),
    },
  },
  component: () => null,
});
