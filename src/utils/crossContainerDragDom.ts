/**
 * DOM helpers for cross-container drag-and-drop (e.g. a card moving between lists).
 *
 * Within a single list/checklist, reordering is handled entirely by React Query +
 * @dnd-kit's sortable plugin — no special DOM work needed.
 *
 * Cross-container moves are different. While you drag, @dnd-kit's OptimisticSortingPlugin
 * physically moves DOM nodes into the target container so siblings shift (drop previews).
 * React's tree still renders the item under the *source* container until we update the
 * cache on drop. Updating the cache while the node lives in the wrong parent causes
 * React to call removeChild on a node that isn't there → hard crash.
 *
 * The sequence on drop is therefore:
 *   1. Put the node back where React expects it (revertToInitialGroup)
 *   2. Remove leftover @dnd-kit placeholder clones
 *   3. Update React Query (applyMoveCard / applyMoveChecklistItemToChecklist)
 *
 * Callers pass element + container refs from the source list/checklist component.
 * See List.tsx / Checklist.tsx onMove handlers.
 */
import { scheduleAfterSortableSettles } from '~/utils/scheduleAfterSortableSettles';

/** Move a dragged wrapper back to its pre-drag index inside the source container. */
export function revertToInitialGroup(
  element: HTMLElement,
  container: HTMLElement,
  initialIndex: number,
) {
  const siblings = [...container.children].filter(
    (node): node is HTMLElement =>
      node instanceof HTMLElement && node !== element,
  );
  const referenceNode = siblings[initialIndex] ?? null;
  container.insertBefore(element, referenceNode);
}

/**
 * @dnd-kit leaves shadow placeholder clones in the DOM during drag (styled in drag.css).
 * They are not React nodes — we have no ref to them — so we query by the attribute
 * the library sets. Safe to remove after a cross-container drop settles.
 */
export function cleanupDndKitPlaceholders() {
  for (const placeholder of document.querySelectorAll(
    '[data-dnd-placeholder]',
  )) {
    placeholder.remove();
  }
}

/**
 * Runs the revert → cleanup → cache-update sequence after @dnd-kit finishes its
 * drag-end DOM work. See scheduleAfterSortableSettles for why we defer.
 */
export function afterCrossContainerDrop({
  element,
  sourceContainer,
  fromIndex,
  applyMove,
}: {
  element: HTMLDivElement | null;
  sourceContainer: HTMLDivElement | null;
  fromIndex: number;
  applyMove: () => void;
}) {
  scheduleAfterSortableSettles(() => {
    if (element && sourceContainer) {
      revertToInitialGroup(element, sourceContainer, fromIndex);
    }

    cleanupDndKitPlaceholders();
    applyMove();
  });
}
