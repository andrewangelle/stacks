import { createServerFn } from '@tanstack/react-start';
import { createCompositeComponent } from '@tanstack/react-start/rsc';
import type { ReactNode } from 'react';
import type { BoardBackground } from '~/components/Boards/Boards.styled';
import { BoardPageBackground } from '~/components/Nav/Nav.styled';
import { getBoardColor } from '~/db/boards/boards.functions';
import { GetBoardByIdSchema } from '~/db/boards/boards.schemas';
import { authMiddleware } from '~/middleware/auth';

export type BoardPageServerProps = {
  children?: ReactNode;
};

export const getBoardPageServer = createServerFn()
  .validator(GetBoardByIdSchema)
  .middleware([authMiddleware])
  .handler(async ({ data }) => {
    const src = await createCompositeComponent(
      async (props: BoardPageServerProps) => {
        const response = await getBoardColor({
          data: { boardId: data.boardId },
        });

        return (
          <BoardPageBackground
            key={response?.boardColor}
            data-testid="BoardPageBackground"
            background={response?.boardColor as BoardBackground}
          >
            {props.children}
          </BoardPageBackground>
        );
      },
    );

    return { src };
  });
