import { createServerFn } from '@tanstack/react-start';
import { createCompositeComponent } from '@tanstack/react-start/rsc';
import type { ReactNode } from 'react';
import { BoardPageBackground } from '~/components/Nav/Nav.styled';
import { boardByIdQueryOptions } from '~/db/boards/boards.query';
import { GetBoardByIdSchema } from '~/db/boards/boards.schemas';
import { authMiddleware } from '~/middleware/auth';
import { getQueryClient } from '~/query';

export type BoardPageServerProps = {
  children?: ReactNode;
};

export const getBoardPageServer = createServerFn()
  .validator(GetBoardByIdSchema)
  .middleware([authMiddleware])
  .handler(async ({ data }) => {
    const queryClient = getQueryClient();
    const board = await queryClient.ensureQueryData(
      boardByIdQueryOptions(data.boardId),
    );

    const src = await createCompositeComponent(
      (props: BoardPageServerProps) => {
        return (
          <BoardPageBackground
            key={board?.boardColor}
            data-testid="BoardPageBackground"
            background={board?.boardColor}
          >
            {props.children}
          </BoardPageBackground>
        );
      },
    );

    return { src };
  });
