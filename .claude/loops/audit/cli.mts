import { readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { parseArgs } from 'node:util';
import { MAX_ITERS, PLANS_DIR } from './constants.mts';
import { main } from './main.mts';
import { errorColors, isFile, resolvePlan } from './utils.mts';

const USAGE =
  'usage: node .claude/loops/audit/cli.ts PLAN [--paths P]... [--run-tests CMD] [--max-iters N]\n' +
  '  PLAN         a plan file path, or a plan name in .claude/plans/\n' +
  '  --paths      repo paths the audit may read: "a b", a,b, or repeat the flag';

let parsed: {
  values: {
    paths: string[];
    'run-tests': string;
    'max-iters': string;
    help: boolean;
  };
  positionals: string[];
};

try {
  parsed = parseArgs({
    allowPositionals: true,
    options: {
      paths: { type: 'string', multiple: true, default: [] },
      'run-tests': { type: 'string', default: '' },
      'max-iters': { type: 'string', default: String(MAX_ITERS) },
      help: { type: 'boolean', short: 'h', default: false },
    },
  });
} catch (err) {
  console.error(
    `${errorColors.error(`error: ${(err as Error).message}`)}\n${USAGE}`,
  );
  process.exit(2);
}

const { values, positionals } = parsed;

if (values.help) {
  console.log(USAGE);
  process.exit(0);
}

if (positionals.length !== 1) {
  console.error(
    `${errorColors.error('error: expected exactly one plan')}\n${USAGE}`,
  );
  process.exit(2);
}

const plan = resolvePlan(positionals[0]);

if (!plan) {
  console.error(errorColors.error(`Plan not found: ${positionals[0]}`));

  let available: string[] = [];

  try {
    available = readdirSync(PLANS_DIR).filter((f) =>
      isFile(resolve(PLANS_DIR, f)),
    );
  } catch {
    // no plans directory
  }

  console.error(
    available.length
      ? `${errorColors.bold('Available plans:')}\n${available.map((f) => `  ${f}`).join('\n')}`
      : `No plans found in ${PLANS_DIR}`,
  );

  process.exit(1);
}

const maxIters = Number(values['max-iters']);

if (!Number.isInteger(maxIters) || maxIters < 1) {
  console.error(
    errorColors.error('error: --max-iters must be a positive integer'),
  );
  process.exit(2);
}

// Accept `--paths "a b"`, `--paths a,b`, and repeated `--paths a --paths b`.
const scopePaths = values.paths
  .flatMap((p) => p.split(/[\s,]+/))
  .filter(Boolean);

const result = await main({
  plan,
  scopePaths,
  testCmd: values['run-tests'],
  maxIters,
});

process.exit(result);
