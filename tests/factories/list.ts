import { faker } from '@faker-js/faker';

export function buildList(title?: string) {
  return { listTitle: title ?? faker.word.words(2) };
}
