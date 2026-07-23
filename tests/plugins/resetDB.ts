import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Plugin } from 'vite';

const fixturesDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../fixtures',
);

function readJsonBody<DataType>(
  req: import('http').IncomingMessage,
): Promise<DataType> {
  return new Promise<DataType>((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', () => {
      if (chunks.length === 0) {
        resolve({} as DataType);
        return;
      }
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString('utf8')));
      } catch (error) {
        reject(error);
      }
    });
    req.on('error', reject);
  });
}

export function resetDB(): Plugin {
  return {
    name: 'e2e-reset',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url === '/__test/health' && req.method === 'GET') {
          res.statusCode = 204;
          res.end();
          return;
        }

        if (req.url === '/__test/reset' && req.method === 'POST') {
          const { resetDB } = await server.ssrLoadModule(
            path.join(fixturesDir, 'reset.ts'),
          );
          await resetDB();
          res.statusCode = 204;
          res.end();
          return;
        }

        if (req.url === '/__test/seed-board' && req.method === 'POST') {
          try {
            const { seedBoard } = await server.ssrLoadModule(
              path.join(fixturesDir, 'seedBoard.ts'),
            );

            const body = await readJsonBody<{
              boardTitle?: string;
              boardColor?: string;
            }>(req);

            const board = await seedBoard({
              boardTitle: body.boardTitle ?? 'Untitled board',
              boardColor: body.boardColor,
            });

            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 200;
            res.end(JSON.stringify(board));
          } catch {
            res.statusCode = 400;
            res.end();
          }
          return;
        }

        if (req.url === '/__test/seed-list-card' && req.method === 'POST') {
          try {
            const { seedListCard } = await server.ssrLoadModule(
              path.join(fixturesDir, 'seedListCard.ts'),
            );

            const body = await readJsonBody<{
              boardId: string;
              listTitle?: string;
              cardTitle?: string;
              checklists: { title: string; items: string[] }[];
            }>(req);

            const seeded = await seedListCard(body);

            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 200;
            res.end(JSON.stringify(seeded));
          } catch {
            res.statusCode = 400;
            res.end();
          }
          return;
        }

        if (req.url === '/__test/seed-activities' && req.method === 'POST') {
          try {
            const { seedActivities } = await server.ssrLoadModule(
              path.join(fixturesDir, 'seedActivities.ts'),
            );

            const body = await readJsonBody<{
              boardId: string;
              listId: string;
              cardId: string;
              count: number;
              type?: string;
            }>(req);

            const seeded = await seedActivities(body);

            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 200;
            res.end(JSON.stringify(seeded));
          } catch {
            res.statusCode = 400;
            res.end();
          }
          return;
        }

        if (req.url === '/__test/seed-card' && req.method === 'POST') {
          try {
            const { seedCard } = await server.ssrLoadModule(
              path.join(fixturesDir, 'seedCard.ts'),
            );

            const body = await readJsonBody<{
              boardId: string;
              listTitle?: string;
              cardTitle?: string;
            }>(req);

            const seeded = await seedCard(body);

            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 200;
            res.end(JSON.stringify(seeded));
          } catch {
            res.statusCode = 400;
            res.end();
          }
          return;
        }

        next();
      });
    },
  };
}
