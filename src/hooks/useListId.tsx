import { createContext, type ReactNode, useContext } from 'react';

const ListIDContext = createContext<string>('');

export function useListId() {
  return useContext(ListIDContext);
}

export function ListIdProvider({
  listId,
  children,
}: {
  listId: string;
  children: ReactNode;
}) {
  return (
    <ListIDContext.Provider value={listId}>{children}</ListIDContext.Provider>
  );
}
