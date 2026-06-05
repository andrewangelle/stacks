import { faker } from '@faker-js/faker';

export function buildCard(title?: string) {
  return {
    cardTitle: title ?? faker.hacker.phrase(),
    cardDescription: faker.lorem.sentence(),
  };
}
