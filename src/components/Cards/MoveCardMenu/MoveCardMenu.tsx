import { Popover } from 'radix-ui';
import { Suspense, useState } from 'react';
import { RxCaretDown } from 'react-icons/rx';

import { MoveCardFields } from '~/components/Cards/MoveCardMenu/MoveCardFields';
import * as styles from '~/components/Cards/MoveCardMenu/MoveCardMenu.css';
import { MoveCardMenuFallback } from '~/components/Cards/MoveCardMenu/MoveCardMenuFallback';
import { useGetListByCardId } from '~/db/lists/lists.query';

export function MoveCardMenu({ id }: { id: string }) {
  const [open, setOpen] = useState(false);
  const { data: list } = useGetListByCardId({ id });

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger
        className={styles.moveCardMenuTrigger}
        data-testid="MoveCardMenuTrigger"
      >
        {list?.listTitle}
        <RxCaretDown size={20} data-testid="RxCaretDown" />
      </Popover.Trigger>

      <Suspense fallback={<MoveCardMenuFallback />}>
        <MoveCardFields id={id} />
      </Suspense>
    </Popover.Root>
  );
}
