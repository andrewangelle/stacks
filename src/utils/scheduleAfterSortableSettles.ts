/**
 * Defer work until after @dnd-kit's sortable plugin finishes reparenting DOM on drag end.
 *
 * dragEnd handlers fire while the library may still be mid-update. Running our revert
 * + React Query writes synchronously in the same tick races that work and brings back
 * the removeChild crashes. A microtask + two animation frames is enough buffer in
 * practice without being noticeable to the user.
 */
export function scheduleAfterSortableSettles(callback: () => void) {
  queueMicrotask(() => {
    requestAnimationFrame(() => {
      requestAnimationFrame(callback);
    });
  });
}
