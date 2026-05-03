import { collectionByTable } from '~/db/collections';

export type LocalEntity = { id: string | number } & Record<string, unknown>;

export type LocalRow = Record<string, unknown>;

export type LocalTableName =
  | 'stacks'
  | 'lists'
  | 'cards'
  | 'checklists'
  | 'checklist-items'
  | 'activity'
  | 'profiles';

export function createId() {
  return (
    globalThis.crypto?.randomUUID?.() ??
    `local-${Date.now()}-${Math.random().toString(36).slice(2)}`
  );
}

export function matchesCriteria(
  row: LocalRow,
  criteria: Record<string, unknown>,
) {
  return Object.entries(criteria).every(([key, value]) => row[key] === value);
}

export function readRowId(row: LocalRow) {
  const id = row.id;
  if (typeof id === 'string' || typeof id === 'number') {
    return id;
  }
  return undefined;
}

export class LocalQueryBuilder {
  private operation: 'select' | 'update' | 'delete' = 'select';
  private updateRows: LocalRow[] = [];

  constructor(private readonly table: LocalTableName) {}

  get data() {
    return [...collectionByTable[this.table].toArray];
  }

  select() {
    this.operation = 'select';
    return this;
  }

  insert(rows: LocalRow[]) {
    const preparedRows = rows.map((row) => ({
      ...row,
      id:
        typeof row.id === 'string' || typeof row.id === 'number'
          ? row.id
          : createId(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }));
    collectionByTable[this.table].insert(preparedRows);
    return Promise.resolve({ data: preparedRows, error: null });
  }

  update(rows: LocalRow[]) {
    this.operation = 'update';
    this.updateRows = rows;
    return this;
  }

  delete() {
    this.operation = 'delete';
    return this;
  }

  match(criteria: Record<string, unknown>) {
    const collection = collectionByTable[this.table];
    const matchedRows = collection.toArray.filter((row) =>
      matchesCriteria(row, criteria),
    );

    if (this.operation === 'select') {
      return Promise.resolve({ data: matchedRows, error: null });
    }

    if (this.operation === 'update') {
      const patch = this.updateRows[0] ?? {};

      matchedRows.forEach((row) => {
        const rowId = readRowId(row);
        if (rowId !== undefined) {
          collection.update(rowId, (draft) => {
            Object.assign(draft, patch);
          });
        }
      });

      const updatedRows = collection.toArray.filter((row) =>
        matchesCriteria(row, criteria),
      );

      return Promise.resolve({ data: updatedRows, error: null });
    }

    matchedRows.forEach((row) => {
      const rowId = readRowId(row);
      if (rowId !== undefined) {
        collection.delete(rowId);
      }
    });
    return Promise.resolve({ data: matchedRows, error: null });
  }
}
