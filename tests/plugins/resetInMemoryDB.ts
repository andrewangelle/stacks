import type { Plugin } from 'vite';

function readJsonBody(req: import('http').IncomingMessage): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', () => {
      if (chunks.length === 0) {
        resolve({});
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

export function resetInMemoryDB(): Plugin {
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
            '~test/fixtures/reset',
          );
          resetDB();
          res.statusCode = 204;
          res.end();
          return;
        }

        if (req.url === '/__test/seed-board' && req.method === 'POST') {
          try {
            const { seedBoard } = await server.ssrLoadModule(
              '~test/fixtures/seedBoard',
            );
            const body = (await readJsonBody(req)) as {
              boardTitle?: string;
              boardColor?: string;
            };
            const board = seedBoard({
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

        next();
      });
    },
  };
}
