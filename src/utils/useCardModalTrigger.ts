import {
  useNavigate,
  useRouter,
  useRouterState,
  useSearch,
} from '@tanstack/react-router';
import {
  type FocusEvent,
  type KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useCurrentBoardId } from '~/utils/useCurrentBoardId';

export function useCardModalTrigger(id: string) {
  const router = useRouter();
  const boardId = useCurrentBoardId();
  const navigate = useNavigate();
  const routerState = useRouterState();
  const [isHovering, setHovering] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const pointerFocusedRef = useRef(false);
  const search = useSearch({ strict: false }) as { from?: string };

  const cardIdNavigatedFrom = search?.from?.split('card-')?.[1];
  const cardIdNavigatingTo = routerState.location?.href.split('card/')?.[1];
  const isNavigatingToSameCard = cardIdNavigatingTo === id;

  function openCardModal() {
    navigate({
      to: '/board/$id/card/$cardId',
      params: { id: boardId, cardId: id },
    });
  }

  function openCardModalToChecklist(checklistId: string) {
    navigate({
      href: `/card/${id.slice(0, 8)}#checklist-${checklistId}`,
      resetScroll: false,
      hashScrollIntoView: false,
    });
  }

  function handleTriggerFocus() {
    setIsFocused(true);
    pointerFocusedRef.current = true;
    router.preloadRoute({
      to: '/board/$id/card/$cardId',
      params: { id: boardId, cardId: id },
    });
  }

  function handleTriggerBlur(event: FocusEvent<HTMLDivElement>) {
    if (event.currentTarget.contains(event.relatedTarget as Node | null)) {
      return;
    }
    setIsFocused(false);
    pointerFocusedRef.current = false;
  }

  function handleListCardMouseEnter() {
    setHovering(true);
    pointerFocusedRef.current = true;
    ref.current?.focus({ preventScroll: true });
    router.preloadRoute({
      to: '/board/$id/card/$cardId',
      params: { id: boardId, cardId: id },
    });
  }

  function handleListCardMouseLeave() {
    setHovering(false);

    if (pointerFocusedRef.current && ref.current === document.activeElement) {
      ref.current?.blur();
    }

    pointerFocusedRef.current = false;
  }

  function handleTriggerKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.target !== event.currentTarget) {
      return;
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openCardModal();
    }
  }

  useEffect(() => {
    if (cardIdNavigatedFrom && id === cardIdNavigatedFrom) {
      ref.current?.focus();
    }
  }, [cardIdNavigatedFrom, id]);

  return {
    ref,
    isHovering,
    isFocused,
    isLoading: routerState.isLoading && isNavigatingToSameCard,
    onBlur: handleTriggerBlur,
    onFocus: handleTriggerFocus,
    onKeyDown: handleTriggerKeyDown,
    onMouseEnter: handleListCardMouseEnter,
    onMouseLeave: handleListCardMouseLeave,
    onPointerDown: handleTriggerFocus,
    onShowMore: openCardModalToChecklist,
    open: openCardModal,
  };
}
